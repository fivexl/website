---
title: 'Moving Terraform Managed Resources Between States for Scaling AWS Infrastructure in Startups'
author_id: 'Andrey_Devyatkin'
summary: 'Find out how the CloudTrail-to-Slack Terraform module by FivexL solves problems for startups and small teams.'
date: 2023-05-05
author: Andrey Devyatkin
panel_image: Cloud_trail_article.png
tags: ['AWS','Terraform']
---
### Introduction

As an AWS cloud engineering consultant at FivexL, we work with startups to help them scale and optimize their AWS infrastructure. A common challenge we encounter is the need to move Terraform managed resources between states. This can arise when reorganizing infrastructure, migrating from one environment to another, or splitting a monolithic state into smaller, more manageable states. In this article, we will discuss two approaches for moving Terraform managed resources between states, with a focus on AWS, and explain why the second approach is generally better in terms of speed, scalability, and reliability.

**Approach 1: Remove and Import - what most of the people do**

The first approach involves using the ```terraform state rm``` command to remove resources from the source state, followed by the ```terraform import``` command to import them into the destination state. This process can be broken down into three steps:

1.  Remove resources from the source state using ```terraform state rm```. This command disassociates the specified resources from the source state file without affecting the actual infrastructure.

2.  Update the Terraform configuration in the destination state to include the desired resources. Ensure that the configuration matches the real-world infrastructure, as this will be necessary for a successful import.

3.  Use the ```terraform import``` command to import the resources into the destination state. The import process associates the specified resources with the destination state file, allowing Terraform to manage them going forward.

While this approach is relatively straightforward, it has some limitations. It can be time-consuming, especially when dealing with a large number of resources, as each resource must be imported individually. Additionally, there is room for human error, as the operator must ensure that the Terraform configuration accurately reflects the actual infrastructure.

**Approach 2: Terraform State Move with ```--state-out``` Flag - what you should be doing instead**

The second approach, which we recommend, is to use the ```terraform state mv``` command along with the --state-out flag. This method offers several advantages over the remove-and-import approach:

1.  Faster execution: The ```terraform state mv``` command moves resources between states in a single operation, eliminating the need to import resources individually. Furthermore, you can move entire modules instead of individual resources, resulting in significant time savings when dealing with hundreds of resources.

2.  Less room for error: Since this approach does not require updating the Terraform configuration to match the infrastructure, there is less risk of mistakes during the process.

3.  Scalability: The ```terraform state mv``` command works well with a large number of resources, making it suitable for large-scale infrastructure migrations.

To use this approach, follow these steps:

1.  Pull the destination state file locally using ```terraform state pull```. Save the output to a file named ```destination.tfstate```. This step will ensure that you have the most recent version of the destination state file:  
```terraform state pull > destination.tfstate```

2.  Use the ```terraform state mv``` command to move resources from the source to the destination state file. Specify the ```--state``` flag to provide the source state file and the   ```--state-out``` flag to provide the destination state file. This command takes the resource address in the source state and the resource address in the destination state as its arguments:  
```python
terraform state mv -state=source.tfstate 
-state-out=destination.tfstate source_resource_address 
destination_resource_address
```

3.  Replace ```source.tfstate``` with the filename of your source state, and ```source_resource_address``` and ```destination_resource_address``` with the appropriate resource addresses.\
    If you're working with a remote state, you can use the ```-state``` flag to reference the local copy of the state file you pulled in step 1, and the ```--state-out``` flag to reference the destination.tfstate file: 
```python 
terraform state mv -state=source.tfstate  
-state-out=destination.tfstate aws_instance.example1  
aws_instance.example2
```
  In this example, an AWS instance with the address ```aws_instance.example1``` in the source state file is moved to the address ```aws_instance.example2``` in the destination state file.

4.  Push the updated destination state file back to the remote backend using ```terraform state push```. This step is essential for ensuring that the remote state reflects the changes made locally:  
```python
terraform state push destination.tfstate
```

### Conclusion

As FivexL AWS cloud engineering consultants, we assist startups in scaling their AWS infrastructure using Terraform. When moving Terraform managed resources between states, we recommend using the ```terraform state mv``` approach with the ```--state-out``` flag, as it is faster, more reliable, and better suited to large-scale infrastructure migrations. The ability to move entire modules, rather than individual resources, further enhances the efficiency of this approach. By following the steps outlined above, you can efficiently reorganize your infrastructure without compromising its stability or consistency.

*Disclaimer: Prompted and proofread by FivexL experts with love. Engineers are good at coming up with clever ideas but not always adept at writing or explaining them. This article is a combination of the experience and ideas of FivexL consultants together with the writing skills of ChatGPT. FivexL is always experimenting with and researching the latest technologies to give their customers every possible advantage.*
