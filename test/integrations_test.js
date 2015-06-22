objective('ensure it works with included plugins', function(should) {

  trace.filter = false

  before(function(){
    mock('dir', require('in.expander.dir'));
  });


  context('in.expander.dir', function() {

      it ('is called on expand.dir', function(In, dir, done) {

      // set expectation on expand.dir() handler

      dir.does(function perform(config, arg1){

        config.should.eql({
          opts: {
            // conf: 'ig'
          },
          expansion: {
            eval: 'expand.dir(\'./\')'
          }
        });

        arg1.should.equal('./');

        return {
          then: function(resolver) {
            resolver(['file1', 'file2']);
          }
        }
      })

      $$in(
        function(
          files // in. {{expand.dir('./')}}
        ){

          files.should.eql ['file1', 'file2']
          done()
        }
      ).then(function(){}, done)

    })

  })


  context('in.actor.shell', function() {

    it.only('is called on shell action', function(In, done) {


      $$in(
        function(
          files // in. {{i for i in [0..10]}}
        ){
          console.log(files)
          // files.should.eql ['file1', 'file2']
          done()
        }
      ).then(function(){}, done)

    })

  })


});
