var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodej");
var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    username : { type: String, required: true, unique: true },
    password : { type: String, required: true },
    createdAt: { type: Date, default: Date.now},
    displayName : String,
    bio : String
});

userSchema.pre("save", function(done){
    var user = this;

    if(!user.isModified("password")){
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err){return done(err);}
        bcrypt.hash(user.password, salt, function(){}, function(err, hashedPassword){
            if (err){return done(err);}
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.name = function(){
    return this.displayName || this.username;
};

userSchema.methods.checkPassword = function(guess, done){
    bcrypt.compare(guess, this.password, function(err, isMatch){
        return done(err, isMatch);
    });

};
