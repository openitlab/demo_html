import * as React from 'react';
import PropTypes from "prop-types";
const CustomSection = (props) => {
  const {bgImage} = props;
  return (
    <div className='section_gap' style={{backgroundImage: `url(${bgImage})`}}>
      
    </div>
  )
}
CustomSection.prototype={
  bgImage:PropTypes.string,
}
export default CustomSection;
