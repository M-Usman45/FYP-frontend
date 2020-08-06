import React, { Component } from "react";
import Joi from "joi-browser";
import * as userService from "../../service/userService";
import { FullCalendar } from "primereact/fullcalendar";
import { Growl } from "primereact/growl";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import { InputText } from "primereact/inputtext";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
class CalenderProfile extends Component {
  constructor() {
    super();
    this.state = {
      fullcalendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultDate: Date.now(),
        header: {
          left: "prev,next today",
          center: "title",
          right: "month,agendaWeek,agendaDay",
        },
        editable: true,
      },
      data: {
         title:"",
         startDate:null,
         endDate:null
            },
      error:"",
      events: [],
      startDate: null,
      endDate: null,
      visibility: false

    };
    this.getEvents = this.getEvents.bind(this);
  }

  componentDidMount() {
    this.getEvents();
  }

  getEvents() {
    userService
      .getevents()
      .then((result) => {
        this.setState({ events: result.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  schema = {
    title: Joi.string().required().label("Title"),
    startDate: Joi.date().required().label("Start Date"),
    endDate: Joi.date().label("End Date"),
    };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);

    return error ? error.details[0].message : null;
  };
  validate = () => {
    const abort = {
      abortEarly: false,
    };
    const { error } = Joi.validate(this.state.data, this.schema, abort);
    if (!error) return null;
    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  onChange = (e) => {
    const data = { ...this.state.data };
    const error = { ...this.state.error };
    const { name, value } = e.currentTarget;
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) error[name] = errorMessage;
    else delete error[name];
    data[name] = value;
    this.setState({ data , error });
  }

  onVisible = ()=>{
    this.setState({visibility:true})
  }
  onHide = ()=>{
    this.setState({visibility:false})
  }
  addEvent = ()=> {
    const { data , startDate , endDate } = this.state
    data["startDate"] = startDate ;
    data["endDate"] = endDate;
    console.log("In submit button" , data)
    const errors = this.validate()
    this.setState({error : errors || {}} ) 
    if(errors){
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Validation Error!",
        });
        return;
    }
    userService
       .addEvent( data.title , data.startDate , data.endDate )
       .then(result=>{
        this.growl.show({
          severity: "success",
          summary: "Event added Successfully!",
        });
        setTimeout(() =>{
          this.setState({visibility: false})
          window.location = "/";
        }, 1000);
       })
       .catch(error => {
        this.growl.show({
          life: "3000",
          severity: "error",
          summary: "Adding asset failed!",
          detail: "Server Error!",
        });
       })
  }
  render() {
    const { events } = this.state;
    return (
      <React.Fragment>
         <Growl ref={(el) => (this.growl = el)} />
         <Dialog
            header={"Add New Event"}
            visible={this.state.visibility}
            footer={<div style={{ height: "25px" }}></div>}
            dismissableMask={true}
            blockScroll={false}
            itemTemplate={this.renderProfileForm}
            onHide={this.onHide}
            //maximizable={true}
            style={{width:"500px"}}
          >
             <div className="p-grid">
               <div className="p-col-12">
                  <label htmlFor="title">Event Title <span style={{color:"red"}}> * </span> </label>  
               </div>
                  <div className="p-col-12">
                    <InputText
                      id="title"
                      name="title"
                      placeholder="Enter Event Title"
                      onChange={this.onChange}
                    />
                    {this.state.error["title"] && (
                         <span style={{ color: "red" }}>
                             {this.state.error["title"]}
                         </span>
                    )}
                  </div>
               <div className="p-col-12">
                  <label htmlFor="title">Start Date <span style={{color:"red"}}> * </span> </label>  
               </div>
               <div className="p-col-12">
                  <Calendar
                  id="startDate"
                  showButtonBar={true}
                  dateFormat="dd/mm/yy"
                  placeholder="Enter Event Start Date dd/mm/yy"
                  showIcon={true}
                  value={this.state.startDate}
                  onChange={(event) => {
                    const { error } = this.state;
                    const obj = {
                      name: "startDate",
                      value: event.value,
                    };
                    this.setState({ startDate: event.value });
                   const errorMessage = this.validateProperty(obj);
                   if (errorMessage) error["startDate"] = errorMessage;
                   else delete error["startDate"];
                   this.setState({ error });
                    }}
                  />
                  {this.state.error["startDate"] && (
                         <span style={{ color: "red" }}>
                             {this.state.error["startDate"]}
                         </span>
                  )}                  
               </div>
               <div className="p-col-12">
                  <label htmlFor="title">End Date</label>  
               </div>
               <div className="p-col-12">
                  <Calendar
                  id="endDate"
                  showButtonBar={true}
                  dateFormat="dd/mm/yy"
                  placeholder="Enter Event End Date dd/mm/yy"
                  showIcon={true}
                  value={this.state.endDate}
                  onChange={(event) => {
                    const { error } = this.state;
                    const obj = {
                      name: "endDate",
                      value: event.value,
                    };
                    this.setState({ endDate: event.value });
                    const errorMessage = this.validateProperty(obj);
                   if (errorMessage) error["endDate"] = errorMessage;
                   else delete error["endDate"];
                   this.setState({ error });
                    }}
                  />               
               </div>  
               <div className="p-col-12">
                  <Button
                    label="Add"
                    onClick={this.addEvent}
                  />
               </div>                     
            </div>
          </Dialog>
          <Panel 
              header={
                <div className="p-grid" style={{height:"60px"}}>
                  <div className="p-col-10">
                   <h3> Calender </h3>
                  </div>
                  <div className="p-col-2"> 
                   <Button
                   style={{marginTop:"10px"}}
                    label="Add Event"
                    onClick={this.onVisible}
                  />
                 </div>
                </div>
              } 
              style={{ height: "100%" }}
          >
               <FullCalendar
                   events={events}
                    options={this.state.fullcalendarOptions} />
          </Panel>
      </React.Fragment>
    );
  }
}

export default CalenderProfile;
