/*
 * create a namespace according to your module, 
 * in my case is Advertisa who is my meteor username, and
 * Chat as collection name
 */
Namespace('Advertisa.Chat');

/*
 * create new mongo collection
 * in my case my collection name will be "advertisa_chat"
 * this is to avoid crash between another collection name called "chat"
 */
Advertisa.Chat = new Mongo.Collection("advertisa_chat");

/*
 * define the schema  
 */
var schemas = new SimpleSchema({
    channelId: {
        type: String,
        label: "Channel",
    },
    message: {
        type: String,
        label: "Message",
    },
    /* AUTOVALUE */
    userId: {
        type: String,
        label: "Created by",
        autoValue: function() {
            if (this.isInsert && this.userId)
                return Meteor.user()._id;
        },
        denyUpdate: true,
        optional: true
    },
    createdAt: {
        type: Date,
        label: "Created At",
        autoValue: function() {
            if (this.isInsert)
                return new Date;
        },
        denyUpdate: true,
        optional: true
    }
});
//attach the schema to collection
Advertisa.Chat.attachSchema(schemas);

/*
 * allow insert for loggedin user which is called group "user"
 * and also allow insert for admin user which is called group "admin"
 * in this tutorial we'll use simple GROUP ROLE functionality
 * you can modify this later if you want to use "userIsInRole" rather than "userIsInGroup"
 */
Advertisa.Chat.allow({
    insert: function(userId, doc) {
        return Meteoris.Role.userIsInGroup("user") || Meteoris.Role.userIsInGroup("admin");
    },
});


/*
 * in meteoris we can use dburles:collection-helper package out of the box
 * so we can get belongsTo relationship easily using this code
 */
Advertisa.Chat.helpers({
    /* belongsTo relation user */
    user: function() {
        return Meteor.users.findOne(this.userId);
    }
});