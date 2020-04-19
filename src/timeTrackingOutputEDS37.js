var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'}); 
const dbConnection = require('./dbConnection');
const query = require('./query');


async function timeTrackingEmailOutput() {
    const categoryResultSet = await dbConnection.queryExecutor(query.category);
    const sectorResultSet = await dbConnection.queryExecutor(query.sector);
    const noInputUsername = await dbConnection.queryExecutor(query.noInputUsernames);

    
    const noInputUsernameString = noInputUsername.length > 0 ? 
    `Note that the following analysts have not yet submitted data for this week: ${noInputUsername.map(row=> row.username).join(', ')}`:
    `Note that all analysts have submitted data for this week.  Go team!!`;
    let tableForCategory = `<table class='table table-bordered votesTable' style='margin-bottom: 15px; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; max-width: 1000px; border: 1px solid #e9ecef;' border='0' cellpadding='0' cellspacing='0' bgcolor='#ffffff'>
    <thead>
      <th class='text-left' style='padding-left: 5px; color: white; font-size: 14px; margin: 0; border: 1px solid white;width:200px' align='left' bgcolor='black' valign='bottom'>Category</th>
      <th class='text-left' style='padding-left: 5px; color: white; font-size: 14px; margin: 0; border: 1px solid white;' align='left' bgcolor='black' valign='bottom'>Time spent this week</th>
      <th class='text-left' style='padding-left: 5px; color: white; font-size: 14px; margin: 0; border: 1px solid white;' align='left' bgcolor='black' valign='bottom'>Share of time spent</th>
    </thead>
    <tbody>`;
    categoryResultSet.forEach(element => {
        const tableRow = `
        <tr style='${element.style}'>
            <td class='text-left' style='border-spacing: 0px; border-collapse: collapse; font-size: 14px; margin: 0; padding: 5px; border: 1px solid white;width:300px' align='left' valign='top'> ${element.category} </td>
            <td class='text-left' style='border-spacing: 0px; border-collapse: collapse; font-size: 14px; margin: 0; padding: 5px; border: 1px solid white;word-break:break-word;width:200px' align='left' valign='top'> ${element.timeSpentThisWeek} </td>
            <td class='text-left' style='border-spacing: 0px; border-collapse: collapse; font-size: 14px; margin: 0; padding: 5px; border: 1px solid white;width:200px' align='left' valign='top'> ${element.shareOfTimeSpend} </td>
        </tr>`;
        tableForCategory = tableForCategory.concat(tableRow);
    });
    tableForCategory = tableForCategory.concat(
        `</tbody>
        </table>`
    )

    let tableForSector = `<table class='table table-bordered votesTable' style='margin-bottom: 15px; font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; max-width: 1000px; border: 1px solid #e9ecef;' border='0' cellpadding='0' cellspacing='0' bgcolor='#ffffff'>
    <thead>
      <th class='text-left' style='padding-left: 5px; color: white; font-size: 14px; margin: 0; border: 1px solid white;' align='left' bgcolor='black' valign='bottom'>Sector</th>
      <th class='text-left' style='padding-left: 5px; color: white; font-size: 14px; margin: 0; border: 1px solid white;' align='left' bgcolor='black' valign='bottom'>Share of time spent on longs</th>
      <th class='text-left' style='padding-left: 5px; color: white; font-size: 14px; margin: 0; border: 1px solid white;' align='left' bgcolor='black' valign='bottom'>Share of time spent on shorts</th>
      <th class='text-left' style='padding-left: 5px; color: white; font-size: 14px; margin: 0; border: 1px solid white;' align='left' bgcolor='black' valign='bottom'>Share of total time spent on research</th>
    </thead>
    <tbody>`;
    sectorResultSet.forEach(element => {
        const tableRow = `
        <tr style='${element.style}'>
            <td class='text-left' style='border-spacing: 0px; border-collapse: collapse; font-size: 14px; margin: 0; padding: 5px; border: 1px solid white;width:300px' align='left' valign='top'> ${element.sector} </td>
            <td class='text-left' style='border-spacing: 0px; border-collapse: collapse; font-size: 14px; margin: 0; padding: 5px; border: 1px solid white;word-break:break-word;width:200px' align='left' valign='top'> ${element.shareOfTimeSpendOnLongs} </td>
            <td class='text-left' style='border-spacing: 0px; border-collapse: collapse; font-size: 14px; margin: 0; padding: 5px; border: 1px solid white;width:200px' align='left' valign='top'> ${element.shareOfTimeSpendOnShort} </td>
            <td class='text-left' style='border-spacing: 0px; border-collapse: collapse; font-size: 14px; margin: 0; padding: 5px; border: 1px solid white;width:200px' align='left' valign='top'> ${element.shareOfTotalTimeSpend} </td>
        </tr>`;
        tableForSector = tableForSector.concat(tableRow);
    })
    tableForSector = tableForSector.concat(
        `</tbody>
        </table>`
    )
   const mailBody = `<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>
    <html xmlns='http://www.w3.org/1999/xhtml'>
    
      <head>
        <meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
        <style type='text/css'>
          .ExternalClass {
            width: 100%
          }
    
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 150%
          }
    
          a {
            text-decoration: none
          }
    
          @media screen and (max-width: 600px) {
    
            table.row th.col-lg-1,
            table.row th.col-lg-2,
            table.row th.col-lg-3,
            table.row th.col-lg-4,
            table.row th.col-lg-5,
            table.row th.col-lg-6,
            table.row th.col-lg-7,
            table.row th.col-lg-8,
            table.row th.col-lg-9,
            table.row th.col-lg-10,
            table.row th.col-lg-11,
            table.row th.col-lg-12 {
              display: block;
              width: 100% !important
            }
    
            .d-mobile {
              display: block !important
            }
    
            .d-desktop {
              display: none !important
            }
    
            .w-lg-25 {
              width: auto !important
            }
    
            .w-lg-25>tbody>tr>td {
              width: auto !important
            }
    
            .w-lg-50 {
              width: auto !important
            }
    
            .w-lg-50>tbody>tr>td {
              width: auto !important
            }
    
            .w-lg-75 {
              width: auto !important
            }
    
            .w-lg-75>tbody>tr>td {
              width: auto !important
            }
    
            .w-lg-100 {
              width: auto !important
            }
    
            .w-lg-100>tbody>tr>td {
              width: auto !important
            }
    
            .w-lg-auto {
              width: auto !important
            }
    
            .w-lg-auto>tbody>tr>td {
              width: auto !important
            }
    
            .w-25 {
              width: 25% !important
            }
    
            .w-25>tbody>tr>td {
              width: 25% !important
            }
    
            .w-50 {
              width: 50% !important
            }
    
            .w-50>tbody>tr>td {
              width: 50% !important
            }
    
            .w-75 {
              width: 75% !important
            }
    
            .w-75>tbody>tr>td {
              width: 75% !important
            }
    
            .w-100 {
              width: 100% !important
            }
    
            .w-100>tbody>tr>td {
              width: 100% !important
            }
    
            .w-auto {
              width: auto !important
            }
    
            .w-auto>tbody>tr>td {
              width: auto !important
            }
    
            .p-lg-0>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-lg-0>tbody>tr>td,
            .py-lg-0>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-lg-0>tbody>tr>td,
            .px-lg-0>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-lg-0>tbody>tr>td,
            .py-lg-0>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-lg-0>tbody>tr>td,
            .px-lg-0>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-lg-1>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-lg-1>tbody>tr>td,
            .py-lg-1>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-lg-1>tbody>tr>td,
            .px-lg-1>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-lg-1>tbody>tr>td,
            .py-lg-1>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-lg-1>tbody>tr>td,
            .px-lg-1>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-lg-2>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-lg-2>tbody>tr>td,
            .py-lg-2>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-lg-2>tbody>tr>td,
            .px-lg-2>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-lg-2>tbody>tr>td,
            .py-lg-2>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-lg-2>tbody>tr>td,
            .px-lg-2>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-lg-3>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-lg-3>tbody>tr>td,
            .py-lg-3>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-lg-3>tbody>tr>td,
            .px-lg-3>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-lg-3>tbody>tr>td,
            .py-lg-3>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-lg-3>tbody>tr>td,
            .px-lg-3>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-lg-4>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-lg-4>tbody>tr>td,
            .py-lg-4>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-lg-4>tbody>tr>td,
            .px-lg-4>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-lg-4>tbody>tr>td,
            .py-lg-4>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-lg-4>tbody>tr>td,
            .px-lg-4>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-lg-5>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-lg-5>tbody>tr>td,
            .py-lg-5>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-lg-5>tbody>tr>td,
            .px-lg-5>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-lg-5>tbody>tr>td,
            .py-lg-5>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-lg-5>tbody>tr>td,
            .px-lg-5>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-0>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-0>tbody>tr>td,
            .py-0>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-0>tbody>tr>td,
            .px-0>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-0>tbody>tr>td,
            .py-0>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-0>tbody>tr>td,
            .px-0>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-1>tbody>tr>td {
              padding: 4px !important
            }
    
            .pt-1>tbody>tr>td,
            .py-1>tbody>tr>td {
              padding-top: 4px !important
            }
    
            .pr-1>tbody>tr>td,
            .px-1>tbody>tr>td {
              padding-right: 4px !important
            }
    
            .pb-1>tbody>tr>td,
            .py-1>tbody>tr>td {
              padding-bottom: 4px !important
            }
    
            .pl-1>tbody>tr>td,
            .px-1>tbody>tr>td {
              padding-left: 4px !important
            }
    
            .p-2>tbody>tr>td {
              padding: 8px !important
            }
    
            .pt-2>tbody>tr>td,
            .py-2>tbody>tr>td {
              padding-top: 8px !important
            }
    
            .pr-2>tbody>tr>td,
            .px-2>tbody>tr>td {
              padding-right: 8px !important
            }
    
            .pb-2>tbody>tr>td,
            .py-2>tbody>tr>td {
              padding-bottom: 8px !important
            }
    
            .pl-2>tbody>tr>td,
            .px-2>tbody>tr>td {
              padding-left: 8px !important
            }
    
            .p-3>tbody>tr>td {
              padding: 16px !important
            }
    
            .pt-3>tbody>tr>td,
            .py-3>tbody>tr>td {
              padding-top: 16px !important
            }
    
            .pr-3>tbody>tr>td,
            .px-3>tbody>tr>td {
              padding-right: 16px !important
            }
    
            .pb-3>tbody>tr>td,
            .py-3>tbody>tr>td {
              padding-bottom: 16px !important
            }
    
            .pl-3>tbody>tr>td,
            .px-3>tbody>tr>td {
              padding-left: 16px !important
            }
    
            .p-4>tbody>tr>td {
              padding: 24px !important
            }
    
            .pt-4>tbody>tr>td,
            .py-4>tbody>tr>td {
              padding-top: 24px !important
            }
    
            .pr-4>tbody>tr>td,
            .px-4>tbody>tr>td {
              padding-right: 24px !important
            }
    
            .pb-4>tbody>tr>td,
            .py-4>tbody>tr>td {
              padding-bottom: 24px !important
            }
    
            .pl-4>tbody>tr>td,
            .px-4>tbody>tr>td {
              padding-left: 24px !important
            }
    
            .p-5>tbody>tr>td {
              padding: 48px !important
            }
    
            .pt-5>tbody>tr>td,
            .py-5>tbody>tr>td {
              padding-top: 48px !important
            }
    
            .pr-5>tbody>tr>td,
            .px-5>tbody>tr>td {
              padding-right: 48px !important
            }
    
            .pb-5>tbody>tr>td,
            .py-5>tbody>tr>td {
              padding-bottom: 48px !important
            }
    
            .pl-5>tbody>tr>td,
            .px-5>tbody>tr>td {
              padding-left: 48px !important
            }
    
            .s-lg-1>tbody>tr>td,
            .s-lg-2>tbody>tr>td,
            .s-lg-3>tbody>tr>td,
            .s-lg-4>tbody>tr>td,
            .s-lg-5>tbody>tr>td {
              font-size: 0 !important;
              line-height: 0 !important;
              height: 0 !important
            }
    
            .s-0>tbody>tr>td {
              font-size: 0 !important;
              line-height: 0 !important;
              height: 0 !important
            }
    
            .s-1>tbody>tr>td {
              font-size: 4px !important;
              line-height: 4px !important;
              height: 4px !important
            }
    
            .s-2>tbody>tr>td {
              font-size: 8px !important;
              line-height: 8px !important;
              height: 8px !important
            }
    
            .s-3>tbody>tr>td {
              font-size: 16px !important;
              line-height: 16px !important;
              height: 16px !important
            }
    
            .s-4>tbody>tr>td {
              font-size: 24px !important;
              line-height: 24px !important;
              height: 24px !important
            }
    
            .s-5>tbody>tr>td {
              font-size: 48px !important;
              line-height: 48px !important;
              height: 48px !important
            }
          }
    
          @media yahoo {
            .d-mobile {
              display: none !important
            }
    
            .d-desktop {
              display: block !important
            }
    
            .w-lg-25 {
              width: 25% !important
            }
    
            .w-lg-25>tbody>tr>td {
              width: 25% !important
            }
    
            .w-lg-50 {
              width: 50% !important
            }
    
            .w-lg-50>tbody>tr>td {
              width: 50% !important
            }
    
            .w-lg-75 {
              width: 75% !important
            }
    
            .w-lg-75>tbody>tr>td {
              width: 75% !important
            }
    
            .w-lg-100 {
              width: 100% !important
            }
    
            .w-lg-100>tbody>tr>td {
              width: 100% !important
            }
    
            .w-lg-auto {
              width: auto !important
            }
    
            .w-lg-auto>tbody>tr>td {
              width: auto !important
            }
    
            .p-lg-0>tbody>tr>td {
              padding: 0 !important
            }
    
            .pt-lg-0>tbody>tr>td,
            .py-lg-0>tbody>tr>td {
              padding-top: 0 !important
            }
    
            .pr-lg-0>tbody>tr>td,
            .px-lg-0>tbody>tr>td {
              padding-right: 0 !important
            }
    
            .pb-lg-0>tbody>tr>td,
            .py-lg-0>tbody>tr>td {
              padding-bottom: 0 !important
            }
    
            .pl-lg-0>tbody>tr>td,
            .px-lg-0>tbody>tr>td {
              padding-left: 0 !important
            }
    
            .p-lg-1>tbody>tr>td {
              padding: 4px !important
            }
    
            .pt-lg-1>tbody>tr>td,
            .py-lg-1>tbody>tr>td {
              padding-top: 4px !important
            }
    
            .pr-lg-1>tbody>tr>td,
            .px-lg-1>tbody>tr>td {
              padding-right: 4px !important
            }
    
            .pb-lg-1>tbody>tr>td,
            .py-lg-1>tbody>tr>td {
              padding-bottom: 4px !important
            }
    
            .pl-lg-1>tbody>tr>td,
            .px-lg-1>tbody>tr>td {
              padding-left: 4px !important
            }
    
            .p-lg-2>tbody>tr>td {
              padding: 8px !important
            }
    
            .pt-lg-2>tbody>tr>td,
            .py-lg-2>tbody>tr>td {
              padding-top: 8px !important
            }
    
            .pr-lg-2>tbody>tr>td,
            .px-lg-2>tbody>tr>td {
              padding-right: 8px !important
            }
    
            .pb-lg-2>tbody>tr>td,
            .py-lg-2>tbody>tr>td {
              padding-bottom: 8px !important
            }
    
            .pl-lg-2>tbody>tr>td,
            .px-lg-2>tbody>tr>td {
              padding-left: 8px !important
            }
    
            .p-lg-3>tbody>tr>td {
              padding: 16px !important
            }
    
            .pt-lg-3>tbody>tr>td,
            .py-lg-3>tbody>tr>td {
              padding-top: 16px !important
            }
    
            .pr-lg-3>tbody>tr>td,
            .px-lg-3>tbody>tr>td {
              padding-right: 16px !important
            }
    
            .pb-lg-3>tbody>tr>td,
            .py-lg-3>tbody>tr>td {
              padding-bottom: 16px !important
            }
    
            .pl-lg-3>tbody>tr>td,
            .px-lg-3>tbody>tr>td {
              padding-left: 16px !important
            }
    
            .p-lg-4>tbody>tr>td {
              padding: 24px !important
            }
    
            .pt-lg-4>tbody>tr>td,
            .py-lg-4>tbody>tr>td {
              padding-top: 24px !important
            }
    
            .pr-lg-4>tbody>tr>td,
            .px-lg-4>tbody>tr>td {
              padding-right: 24px !important
            }
    
            .pb-lg-4>tbody>tr>td,
            .py-lg-4>tbody>tr>td {
              padding-bottom: 24px !important
            }
    
            .pl-lg-4>tbody>tr>td,
            .px-lg-4>tbody>tr>td {
              padding-left: 24px !important
            }
    
            .p-lg-5>tbody>tr>td {
              padding: 48px !important
            }
    
            .pt-lg-5>tbody>tr>td,
            .py-lg-5>tbody>tr>td {
              padding-top: 48px !important
            }
    
            .pr-lg-5>tbody>tr>td,
            .px-lg-5>tbody>tr>td {
              padding-right: 48px !important
            }
    
            .pb-lg-5>tbody>tr>td,
            .py-lg-5>tbody>tr>td {
              padding-bottom: 48px !important
            }
    
            .pl-lg-5>tbody>tr>td,
            .px-lg-5>tbody>tr>td {
              padding-left: 48px !important
            }
    
            .s-lg-0>tbody>tr>td {
              font-size: 0 !important;
              line-height: 0 !important;
              height: 0 !important
            }
    
            .s-lg-1>tbody>tr>td {
              font-size: 4px !important;
              line-height: 4px !important;
              height: 4px !important
            }
    
            .s-lg-2>tbody>tr>td {
              font-size: 8px !important;
              line-height: 8px !important;
              height: 8px !important
            }
    
            .s-lg-3>tbody>tr>td {
              font-size: 16px !important;
              line-height: 16px !important;
              height: 16px !important
            }
    
            .s-lg-4>tbody>tr>td {
              font-size: 24px !important;
              line-height: 24px !important;
              height: 24px !important
            }
    
            .s-lg-5>tbody>tr>td {
              font-size: 48px !important;
              line-height: 48px !important;
              height: 48px !important
            }
          }
    
        </style>
      </head> <!-- Edit the code below this line -->
    
      <body style='outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 14px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; margin: 0; padding: 0; border: 0;'>
        <table valign='top' class='bg-light body' style='outline: 0; width: 100%; min-width: 100%; height: 100%; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; font-family: Helvetica, Arial, sans-serif; line-height: 24px; font-weight: normal; font-size: 14px; -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; margin: 0; padding: 0; border: 0;' bgcolor='#f8f9fa'>
          <tbody>
            <tr>
              <td valign='top' style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; margin: 0;' align='left' bgcolor='#f8f9fa'> <br>
                <table class='container' border='0' cellpadding='0' cellspacing='0' style='font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;'>
                  <tbody>
                    <tr>
                      <td align='center' style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; margin: 0; padding: 0 16px;'>
                        <!--[if (gte mso 9)|(IE)]>           <table align='center'>             <tbody>               <tr>                 <td width='100%'>         <![endif]-->
                        <table align='center' border='0' cellpadding='0' cellspacing='0' style='font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 100%; margin: 0 auto;'>
                          <tbody>
                            <tr>
                              <td style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; margin: 0;' align='left'>
                                <table class='card w-100 ' border='0' cellpadding='0' cellspacing='0' style='font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: separate !important; border-radius: 4px; width: 100%; overflow: hidden; border: 1px solid #dee2e6;' bgcolor='#ffffff'>
                                  <tbody>
                                    <tr>
                                      <td style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; width: 100%; margin: 0;' align='left'>
                                        <div style='border-top-width: 5px; border-top-color: #1822af; border-top-style: solid;'>
                                          <table class='card-body' border='0' cellpadding='0' cellspacing='0' style='font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%;'>
                                            <tbody>
                                              <tr>
                                                <td style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; width: 100%; margin: 0; padding: 20px;' align='left'>
                                                  <div>
                                                    <table class='float-left' align='left' border='0' cellpadding='0' cellspacing='0' style='font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse;'>
                                                      <tbody>
                                                        <tr>
                                                          <td style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; margin: 0;' align='left'> <img class='' width='89' height='50' src='https://edsprod.s3.amazonaws.com/home/img/Hound_brindle.png' style='height: auto; line-height: 100%; outline: none; text-decoration: none; border: 0 none;'> </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class='float-right' align='right' border='0' cellpadding='0' cellspacing='0' style='font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse;'>
                                                      <tbody>
                                                        <tr>
                                                          <td style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; margin: 0;' align='left'> <img class='' width='86.5' height='50' src='https://s3.amazonaws.com/edsprod/home/img/houndPartnersLogo.png' style='height: auto; line-height: 100%; outline: none; text-decoration: none; border: 0 none;'> </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table class='table-unstyled' border='0' cellpadding='0' cellspacing='0' style='font-family: Helvetica, Arial, sans-serif; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0px; border-collapse: collapse; width: 100%; max-width: 100%;' bgcolor='transparent'>
                                                      <tbody>
                                                        <tr>
                                                          <td style='border-spacing: 0px; border-collapse: collapse; line-height: 24px; font-size: 14px; border-top-width: 0; border-bottom-width: 0; margin: 0;' align='left'> <br> Please see below for this week’s summary of time spent.<br><br>${noInputUsernameString}</td>
                                                        </tr>
                                                      </tbody>
                                                    </table> <br><br>${tableForCategory} <br> <br>
                                                      ${tableForSector}
                                                    <br> <br>
                                                    <div class='text-center' style='' align='center'>
                                                      
                                                    </div>
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <div align='center' style='margin-bottom: 0; color: inherit; vertical-align: baseline; font-size: 10px; line-height: 17px;'> This is an autogenerated email. </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <!--[if (gte mso 9)|(IE)]>                 </td>               </tr>             </tbody>           </table>         <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    
    </html>
    `;


    const params = {
        Destination: {
          ToAddresses: [
            // "eds-hound@equitydatascience.com",
            // "cw@houndpartners.com",
            // "jsalinas@houndpartners.com",
            // "ezhang@houndpartners.com"
            "bijal@equitydatascience.com"
            //,"amit@equitydatascience.com"
          ]
        },
        Message: {
          Body: {
            Html: {
             Charset: "UTF-8",
             Data: mailBody
            }
           },
           Subject: {
            Charset: "UTF-8",
            Data: "Weekly Brindle summary statistics"
           }
          },
        Source: "Support For Equity Data Science <support@equitydatascience.com>",
      };
      
      // Create the promise and SES service object
      const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
      
      // Handle promise's fulfilled/rejected states
      sendPromise.then(
        function(data) {
        console.log(data);
          console.log(data.MessageId);
        }).catch(
          function(err) {
          console.error(err, err.stack);
        });
    // TODO
    // Note that the following analysts have not yet submitted data for this week: Chris Webber, Eric Zhang.  [if everyone has submitted an entry for the week this should instead read: “Note that all analysts have submitted data for this week.  Go team!!”]

}
// timeTrackingEmailOutput()
exports.default = timeTrackingEmailOutput;