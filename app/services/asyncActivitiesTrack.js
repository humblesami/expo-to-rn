export default Statemanager = {    
    update_loaders(type_name, activity_path, decription=''){
        if(type_name == 'add')
        {
            Statemanager.dict[activity_path] = 1;            
        }
        else
        {
            delete Statemanager.dict[activity_path];
        }
        this.list = Object.keys(this.dict);
        console.log('On Going Activities', this.list);
    },
    dict: {},
    list: {}
}