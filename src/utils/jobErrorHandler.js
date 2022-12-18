//Handling errors
exports.handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {
      title: "",
      description: "",
      location: "",
      jobType: "",
      salary: "",
     keyword: "",
      companyName: "",
    };
  
  
    if (err.message.includes("Job validation failed"))
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
  
    return errors;
  };