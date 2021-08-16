module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) =>{
    const errors={};
    if(username.trim()===''){
        errors.username = 'Username must not be empty';
    }
    if(email.trim()===''){
        errors.email = 'Email must not be empty';
    }else {
        const regEx =/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email.match(regEx)){
            errors.email = 'Email must be a valid email address';
        }
    }
    if(password === ''){
        errors.password= 'Password must not be empty'
    }else if(password !== confirmPassword){
        errors.confirmPassword='Passwords must match';
    }
    return{
        errors,
        valid:Object.keys(errors).length<1
    }
};

module.exports.validateLoginInput= (username,password) =>{
    const errors={};
    if(username.trim()===''){
        errors.username = 'Username must not be empty';
    }
    if(password.trim()===''){
        errors.password = 'Password must not be empty';
    }
    return{
        errors,
        valid:Object.keys(errors).length<1
    }
}
module.exports.validateOrgInput=(orgName,orgDescription,orgLocationLat,orgLocationLong,orgType)=>{
    if(orgName.trim()===''){
        errors.orgName = 'Organization Name must not be empty';
    }
    if(orgDescription.trim()===''){
        errors.orgDescription = 'Organization Description must not be empty';
    }
    if(orgLocationLat===''){
        errors.orgLocationLat = 'Organization Latitude Location must not be empty';
    }
    if(orgLocationLong===''){
        errors.orgLocationLong = 'Organization Longitude Location must not be empty';
    }
    if(orgType.trim()===''){
        errors.orgType = 'Organization Longitude Location must not be empty';
    }
}

module.exports.validateActInput=(actName,actDescription,actLocationLat,actLocationLong,actType)=>{
    if(actName.trim()===''){
        errors.username = 'Action Name must not be empty';
    }
    if(actDescription.trim()===''){
        errors.username = 'Action Description must not be empty';
    }
    if(actLocationLat.trim()===''){
        errors.username = 'Action Latitude Location must not be empty';
    }
    if(actLocationLong.trim()===''){
        errors.username = 'Action Longitude Location must not be empty';
    }
}

module.exports.validateOrganizationInput = (
    orgname,
    description,
    orgType,
    lat,
    long
) =>{
    const errors={};
    if(orgname.trim()===''){
        errors.orgname = 'Organization Name must not be empty';
    }
    if(description.trim()===''){
        errors.description = 'Description must not be empty';
    }
    
    if(orgType === ''){
        errors.orgType= 'Organization Type must not be empty'

    }
    if(lat === ''){
        errors.lat= 'Latitude Type must not be empty'

    }
    if(long === ''){
        errors.long= 'Longitude  must not be empty'

    }
    return{
        errors,
        valid:Object.keys(errors).length<1
    }
};