var loopback = require('loopback');

module.exports = function (app) {
    var MarketplaceUser = app.models.MarketplaceUser;
    var zorro = {
        firstName: "Test",
        lastName: "Account",
        password: "password",
        email: "zoro@email.com",
        providerAccount: { rating: 1 }
    };
    function addRating(user, newRating, cb) {
        user.providerAccount.allRatings.create(newRating, function (err, inst) {
            //user.providerAccount.unsetAttribute('id'); //this fixes duplicate entry issue)
            if (!err) {
                user.providerAccount.rating += 1;
                user.save(function (err, inst) {
                    cb(err);
                });
            } else {
                cb(err);
            }
        });
    }
    MarketplaceUser.create(zorro,
        function (err, zorroAccount) {

            // THIS DOESNT WORK :(
            // listed as a helper method at https://docs.strongloop.com/display/public/LB/Embedded+models+and+relations
            //TypeError: Object #<ModelConstructor> has no method 'create'
            //zorroAccount.providerAccount.create({rating: 4}, function(err, inst) {
            //    console.log(inst);
            //});

            console.log("NEW providerAccount id: ", zorroAccount.providerAccount.id); //id = undefined. This is expected/good

            zorroAccount.providerAccount.allRatings.create({ rating: 4, userId: zorroAccount.id, comment: "This rocks!!", username: "Jack" }, function (err, inst) {

                console.log("CREATE 1 id: ", zorroAccount.providerAccount.id); //there should be no ID on providerAccount but there is...

                // THIS DOESNT WORK :(
                // listed as a helper method at https://docs.strongloop.com/display/public/LB/Embedded+models+and+relations
                //Error: Invalid reference: undefined
                //at EmbedsMany.add (/node_modules/loopback-datasource-juggler/lib/relation-definition.js:2768:11)
                //zorroAccount.providerAccount.allRatings.add({ rating: 4, userId: zorroAccount.id, comment: "This rocks!!", username: "Jack" }, function (err, inst) {
                //    console.log("333", zorroAccount.providerAccount.id);
                //    console.log("Comment 2 created for Zoro");
                //});

                zorroAccount.providerAccount.allRatings.create({ rating: 4, userId: zorroAccount.id, comment: "This rocks!!", username: "Jack" }, function (err, inst) {

                    console.log("CREATE 2 id: ", zorroAccount.providerAccount.id); //there should be no ID on providerAccount but there is...

                    zorroAccount.providerAccount.rating = 5;
                    zorroAccount.save(function(err) {

                        console.log("1st user.save() err: ", err); //null

                        zorroAccount.providerAccount.rating = 6;
                        zorroAccount.save(function (err) {

                            console.log("2nd user.save() err: ", err); //null

                            console.log("prover account after 2 user.save() calls", zorroAccount.providerAccount);
                            //there should be no id fields on each rating yet there is...

                            addRating(zorroAccount, { rating: 4, userId: zorroAccount.id, comment: "This rocks!!", username: "Jack" }, function(err) {
                                console.log("1st add rating err: ", err); //[Error: Duplicate entry for Provider.id]
                                addRating(zorroAccount, { rating: 4, userId: zorroAccount.id, comment: "This rocks!!", username: "Jack" }, function(err) {
                                    console.log("2nd add rating err: ", err); //[Error: Duplicate entry for Provider.id]
                                });
                            });
                        });
                    });
                });
            });

            //console.log(zorroAccount.providerAccount.updateAttributes); // [Function: updateAttributes] (why?)

            // THIS DOESNT WORK :(
            // listed as a helper method at https://docs.strongloop.com/display/public/LB/Embedded+models+and+relations
            //console.log(zorroAccount.providerAccount.update); //undefined
            // zorroAccount.providerAccount.update(function(err,inst) {
            //    console.log(inst);
            //    zorroAccount.providerAccount.rating = 6;
            //    zorroAccount.providerAccount.update(function(err,inst) {
            //        console.log(inst);
            //    });
            //});
        });
};
