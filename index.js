const express= require('express')
const app=express()
const path=require('path')
const bodyparse=require('body-parser')
app.use(bodyparse.json())
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


 app.set("view.engine","ejs")
 app.use(express.json())
 app.use(express.urlencoded({extended:true}));
 app.use(express.static(path.join(__dirname,"public")));
 


//  app.get('/',(req,res)=>{
//     res.render('index.ejs')
//  })

const generate = async (prompt) => {
    try {
      const result = await model.generateContent(prompt);
      // console.log(result.response.text());
      return result.response.text();
    } catch (error) {
      console.log(error);
    }
  };
  // generate();
  
  
  
  // app.get("/api/content", async (req, res) => {
  //  const data=req.query.question;
  // //  console.log(data)
  //   //  const data="what is ejs in javascript"
  //   const result = await generate(data);
    
  //   if(result) {
  //    const  cleanoutput=result.replace(/[^\w\s]/g, "")
  //    return cleanoutput
  //   }
  //    const newdata=cleanoutput
  //   res.render('index.ejs',{newdata:newdata})
  //   // res.render('index.ejs',{result:result})
    
  // });

  app.get("/api/content", async (req, res) => {
    const data = req.query.question; // Access query parameters
    // Generate content based on the input data
    try {
        const result = await generate(data);
 
        // If result exists, clean the output by removing special characters
        if (result) {
            const cleanoutput = result.replace(/[^\w\s]/g, ""); // Remove special characters
            const newdata = cleanoutput; // Assign cleaned output to newdata
 
            // Render the 'index.ejs' page with the newdata variable
            return res.render('index.ejs', { newdata: newdata });
        }
 
        // If no result, render the page with an empty string or a fallback value
        res.render('index.ejs', { newdata: "" });
    } catch (error) {
        // Handle errors gracefully and render an error message
        console.error(error);
        res.status(500).render('index.ejs', { newdata: "An error occurred while generating content." });
    }
 });
 
  
  app.listen(3001, () => {
    console.log("server is up and running on port number 3001");
  });
  



