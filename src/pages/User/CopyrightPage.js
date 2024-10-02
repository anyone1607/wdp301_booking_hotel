import React from 'react';
import logo from '../../assets/photos/logo.png';
import { Link } from "react-router-dom";
const CopyrightPage = () => {
  return (
  
    <div >
       <div style={{ display: 'flex', justifyContent: 'center', marginTop:'50px', marginBottom: '50px'}}>
    <Link to="/" className="logo-link">
        <img src={logo} alt="logo" className="logo" />
      </Link>
      </div>
      <h1 style={{ textAlign: 'center', marginTop:' 30px', marginBottom: '20px' }}>Copyright</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
  <div style={{ width: '50%', textAlign: 'justify' }}>
  <p>
  All rights reserved. Copyright © 2024 Touristic. This website is protected by copyright law and other intellectual property protection tools.
</p>
<p>
  All content on the website, including text, images, graphics, logos, icons, videos, and audio, is owned by Touristic or its partner owners. Any form of copying, distribution, reuse, or reproduction of content from this website is prohibited without written consent from Touristic.
</p>
<p>
  Any copyright infringement of the content on this website will be considered a violation of the law, and we will take legal measures to protect our rights.
</p>
<p>
  If you have any questions about copyright or wish to use content from this website, please contact us for advice and written consent.
</p>

    </div>
    </div>
    </div>
 
  );
};

export default CopyrightPage;
