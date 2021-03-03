const path = require('path')
const async = require('async')
const newman = require('newman')

const PARALLEL_RUN_COUNT = 1

const parametersForTestRun = {
    collection: path.join(__dirname, 'Automated_tests.json'), // your collection
//    folder: 'Basic',
    environment: path.join(__dirname, 'ENV-mvp.fhir.int.json'), //your env
//    reporters: ['htmlextra', 'html', 'cli', 'json'],
    reporters: ['html', 'cli'],
    delayRequest:50,
    reporter: {
        html: {
          'template': 'templates/htmlreqres.hbs', // this is optional,
          'export': 'verbose-report.html'
        }
    }//,        

//    iterationData: path.join(__dirname, 'rundata.csv') //your data file
   
};

parallelCollectionRun = function (done) {
    newman.run(parametersForTestRun, done);
};

let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
}

// Runs the Postman sample collection thrice, in parallel.
async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);

        results.forEach(function (result) {
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
        });
    });