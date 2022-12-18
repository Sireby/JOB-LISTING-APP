//Error Handler
exports.handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      skill: "",
      experience: "",
      location: "",
    };
  
    if (err.code === 11000) {
      errors.email = "This Email or Username already exists";
      return errors;
    }
  
    
    if (err.message.includes("User validation failed"))
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
  
    return errors;
  };