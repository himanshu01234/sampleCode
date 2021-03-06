const { CronJob } = require('cron');
const moment = require('moment');

const { serviceService, serviceTimerService } = require('../services');

(function init() {
  /* *********************************************Every Modnight at 08:10(UTC)******************************************** */
  // const job = new CronJob("00 00 00 * * *", async () =>
  const job = new CronJob('* * * * *', async () => {
    console.log('**********************************Cron Job for service***************************');
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    console.log(today);
    const query = {
      date: {
        $lte: today,
      },
      status: 'pending',
    };
    let services = await serviceService.updateServiceByCron(query);
    console.log(services);
  });
  job.start();
})();

(function init() {
  /* *********************************************Every Modnight at 08:10(UTC)******************************************** */
  // const job = new CronJob("00 00 00 * * *", async () =>
  const job = new CronJob('* * * * *', async () => {
    console.log('**********************************Cron Job for service***************************');
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    const query = {
      date: {
        $gt: today,
      },
      status: 'pending',
      postOn: 'portal',
    };
    let services = await serviceService.queryServicesForAdmin(query);
    let timer = await serviceTimerService.getServiceTimer();
    let d = new Date();
    let hour = d.getHours();
    let min = d.getMinutes();
    services.map((x) => {
      let serviceDateArray = x.date.split('/');
      let serviceTimeArray = x.time.split(':');
      if (hour < 10) {
        today = `${yyyy}-${mm}-${dd}T0${hour}:${min}:00`;
      }
      if (min < 10) {
        today = `${yyyy}-${mm}-${dd}T0${hour}:0${min}:00`;
      }
      if (hour >= 10 && min >= 10) today = `${yyyy}-${mm}-${dd}T${hour}:${min}:00`;
      let serviceTime = `${serviceDateArray[2]}-${serviceDateArray[0]}-${serviceDateArray[1]}T${serviceTimeArray[0]}:${serviceTimeArray[1]}:00`;
      let b = moment(today);
      let a = moment(serviceTime);
      console.log(today, serviceTime);

      let hourLeft = a.diff(b, 'hours');
      console.log(timer.timer, hourLeft);
      if (timer.timer >= hourLeft) {
        serviceService.moveServiceByCron(x._id);
      }
    });
  });
  job.start();
})();

// (function init() {
//   /* *********************************************Every Modnight at 08:10(UTC)******************************************** */
//   // const job = new CronJob("00 00 00 * * *", async () =>
//   const job = new CronJob('* * * * *', async () => {
//     console.log('**********************************Cron Job for service***************************');
//     let today = new Date();
//     let dd = String(today.getDate()).padStart(2, '0');
//     let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//     let yyyy = today.getFullYear();
//     today = mm + '/' + dd + '/' + yyyy;

//     const query = {
//       // date: {
//       //   $gt: today,
//       // },
//       status: 'assigned',
//       paymentType: 'hourly',
//     };
//     let services = await serviceService.queryServicesForAdmin(query);

//     let timer = await serviceTimerService.getServiceTimer();
//     let d = new Date();
//     let hour = d.getHours();
//     let min = d.getMinutes();
//     services.map((x) => {
//       let serviceDateArray = x.date.split('/');
//       let serviceTimeArray = x.time.split(':');
//       today = `${yyyy}-${mm}-${dd}T${hour}:${min}:00`;
//       let serviceTime = `${serviceDateArray[2]}-${serviceDateArray[0]}-${serviceDateArray[1]}T${serviceTimeArray[0]}:${serviceTimeArray[1]}:00`;
//       let b = moment(today);
//       let a = moment(serviceTime);
//       let hourLeft = a.diff(b, 'hours');
//       console.log(timer.timer, hourLeft);
//       if (timer.timer >= hourLeft) {
//         serviceService.moveServiceByCron(x._id);
//       }
//     });
//   });
//   job.start();
// })();
