import mongoose from 'mongoose'

const DatesSchema = mongoose.Schema([
    {
      _id: false,
      start: {
        type: [
          {
            _id: false,
            dateTime: String
          }
        ]
      }
    }
  ])
  
  const VenuesSchema = mongoose.Schema([
    {
      _id: false,
      name: String,
      id: String,
      url: String,
      type: {
        type: String
      },
      country: Object
    }
  ]);
  
  const EventSchema = mongoose.Schema({
    name: {
      type: String,
      require: true
    },
    type: {
      type: String,
      require: true
    },
    images: {
      type: [
        { 
          _id: false, 
          url: String, 
          width: Number, 
          height: Number 
        }
      ]
    },
    dates: {
      type: DatesSchema
    },
    _embedded: {
      type: [
        {
          _id: false,
          venues: {
            type: [
  
              VenuesSchema
            ]
          },
          attractions: {
            type: [{
              name: String
            }]
          }
        }
      ]
    }
  });
  
const Event = mongoose.model("Event", EventSchema);
module.exports = Event;