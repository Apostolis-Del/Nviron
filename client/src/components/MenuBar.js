import React, { useContext, useState } from 'react';
import { Menu,Image,Item } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import {AuthContext} from '../context/auth';
import logo from '../img/logo.png'

function MenuBar() {
    
  //kanoyme destructure to context(sto login.js den xreiazotan destructure gt tha itan confusing)
  const {user,logout}=useContext(AuthContext);

  //auto edw einai gia na ta allazoume apo tin grammi panw(autin pou exei i istoselida)
 const pathname = window.location.pathname;
 const path = pathname==='/' ?'home' :pathname.substr(1);
 const [activeItem,setActiveItem] = useState(path);

 const handleItemClick = (e, { name }) => setActiveItem(name);

//ena or gia na epistrefoume diaforetika MenuBars
const MenuBar = user ?(

  <Menu pointing secondary size="massive" color="green">
          
          <Item.Image style={{background:"no-repeat" ,
                    width:"120px",
                    top: "-10px",
                    height:"70px",
                    display:"block"
                    }} size='massive' active={activeItem === 'home'}  name='home'
                    as={Link} to="/"
                    src={logo}
              />

          <Menu.Menu position='right'>
          <Menu.Item 
            name={user.username}
            active
            as={Link}
            to="/userprofile"
          />
            <Menu.Item
                name='logout'
                onClick={logout}
            />    
          </Menu.Menu>
        </Menu>


):(

  <Menu pointing secondary size="massive" color="green" >
          <Item.Image style={{background:"no-repeat" ,
                    width:"120px",
                    top: "-10px",
                    height:"70px",
                    display:"block"
                    }} size='massive' active={activeItem === 'home'}  name='home'
                    as={Link} to="/"
                    src={logo}/>
         
          <Menu.Menu position='right'>
            <Menu.Item
                name='login'
                active={activeItem === 'login'}
                onClick={handleItemClick}
                as={Link}
                to="/login"
            />    
            <Menu.Item
              name='register'
              active={activeItem === 'register'}
              onClick={handleItemClick}
              as={Link}
               to="/register"
            />
          </Menu.Menu>
        </Menu>

);

//kanoume return to MenuBar sto view analoga me to ti authcontext exoume
return MenuBar
  
}
export default MenuBar;