const mongoose = require('mongoose');
const { Schema } = mongoose;

//Sub document collection
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema],
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  dateSent: Date,
  lastResponded: Date

});

// _user makes use of a ref relationship = points to the owner of this survey

mongoose.model('surveys', surveySchema);