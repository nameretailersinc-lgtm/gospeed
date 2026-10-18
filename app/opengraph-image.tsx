import {ImageResponse} from 'next/og';
export const alt='GoSpeedRaceway — Motorsport engineering, made useful';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{width:'100%',height:'100%',background:'#101d31',color:'white',display:'flex',flexDirection:'column',justifyContent:'center',padding:'75px',fontFamily:'sans-serif'}}><div style={{display:'flex',fontSize:24,letterSpacing:5,color:'#79a6ff',marginBottom:35}}>GOSPEED RACEWAY</div><div style={{display:'flex',fontSize:74,fontWeight:800,lineHeight:1.1}}>Motorsport engineering,</div><div style={{display:'flex',fontSize:74,fontWeight:800,lineHeight:1.1,color:'#79a6ff'}}>made useful.</div><div style={{display:'flex',fontSize:26,color:'#acbad0',marginTop:45}}>36 calculators · Clear formulas · Better-informed setups</div></div>,size);}
