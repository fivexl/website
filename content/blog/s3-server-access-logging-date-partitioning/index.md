---
title:  'Get Ready to Slice and Dice Your S3 Logs: Amazon S3 server access logging now supports automatic date-based partitioning'
author_id: 'Alexey Eremin'
summary: 'Amazon S3 server access logging now supports automatic date-based partitioning for log delivery. This allows services like Amazon Athena to improve performance and reduce cost when querying logs.'
date: 2023-12-14
author: Alexey Eremin
panel_image: lesha_s3c.png
tags: [ 'S3', 'Athena', 'logs', 'partitioning', 'AWS']
---
In a recent project for a Swedish startup, we've taken a leap forward in optimizing cloud storage solutions largely due to the utilization of Athena partitioning. In this article, I will describe how to use the same idea in the context of S3 access logs.
Amazon S3 server access logging now [supports](https://aws.amazon.com/about-aws/whats-new/2023/11/amazon-s3-server-access-logging-date-partitioning/) automatic date-based partitioning for log delivery. This allows services like Amazon Athena to improve performance and reduce cost when querying logs.  
{{< image src="get-ready-to-slice-and-dice-your-s3-logs.png" alt="Slice and Dice Your S3 logs" width="55%" align="left" style="border-radius: 5px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}

### How to enable log delivery with date-based partitioning?

1. Go to the Properties tab of the source bucket:  
{{< image src="bucket-properties.png" alt="s3 bucket properties tab" width="55%" align="left" style="border-radius: 5px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}
2. Find the section for server access logging:  
{{< image src="server-access-logging.png" alt="s3 server access logging section" width="80%" align="left" style="border-radius: 5px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}
3. Specify the target bucket and prefix where you want to store the logs and set log object key format to the second option.  
{{< image src="server-access-logging-configuration.png" alt="S3 server access logging configuration. Date based partitioning.n" width="80%" align="left" style="border-radius: 5px; box-shadow: 2px 1px 3px 0 rgba(0,0,0, 0.3)" >}}


You can find more details here: [How do I enable log delivery?](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerLogs.html#server-access-logging-overview)

### How to query partitioned s3 access logs using Athena?
I've created terraform [module](https://github.com/fivexl/terraform-aws-s3-access-logs-athena-table) that creates an AWS Glue table designed specifically to query Amazon S3 server access logs in the new [date-based partitioning](https://aws.amazon.com/about-aws/whats-new/2023/11/amazon-s3-server-access-logging-date-partitioning/) format.
Simply specify the bucket name and prefix where the logs are stored and the module will create a table:    
```hcl
module "s3_access_logs_glue_table" {
  source = "./modules/s3-access-logs-glue-table"

  name          = "s3_access_logs"
  database_name = aws_glue_catalog_database.s3_access_logs_db.name
  location      = "s3://my-logs-bucket/my-logs-prefix"
}
```
After that you can query the table using Athena:
```sql
SELECT *
FROM 
    s3_access_logs
WHERE
    accountid = '111111111111'
    and bucket = 'my-bucket' // name of the bucket for which you enabled logging
    and region = 'eu-central-1' // region where the bucket is located
    and year = '2023'
    and month = '11'
    and day = '25'
```
This way Athena will only scan the logs for the specified date and will not incur any additional cost for scanning the entire log bucket (as it happens by default).

If you have any questions or suggestions, feel free to contact me on [LinkedIn](https://www.linkedin.com/in/alexey-eremin/), or [Twitter](https://twitter.com/AA_Eremin)

# TODO:
- [ ] Update link to the terraform module in tf.hcl after module published to the registry