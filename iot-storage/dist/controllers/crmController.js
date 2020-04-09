"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//   /lib/controllers/crmController.ts
const mongoose = require("mongoose");
const crmModel_1 = require("../models/crmModel");
const Contact = mongoose.model('ContactV2', crmModel_1.ContactSchema);
class ContactController {
    addNewProbe(req, res) {
        let newProbe = new crmModel_1.AnySchema(req.body);
        let GenericModel = mongoose.model(req.params.contactId, crmModel_1.AnySchema);
        let instance = new GenericModel(req.body);
        instance.save((err, entity) => {
            if (err) {
                res.send(err);
            }
            else {
                res.json(entity);
            }
        });
    }
    addNewContact(req, res) {
        let newContact = new Contact(req.body);
        newContact.save((err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    getContacts(req, res) {
        Contact.find({}, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    getContactWithID(req, res) {
        Contact.findById(req.params.contactId, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    updateContact(req, res) {
        Contact.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }
    deleteContact(req, res) {
        Contact.remove({ _id: req.params.contactId }, (err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!' });
        });
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=crmController.js.map