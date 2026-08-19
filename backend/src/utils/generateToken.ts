import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: {
  userId: number;
  role: string;
}) => {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "30m",
    }
  );
};
export const generateRefreshToken=(payload:{
  userId:number,
})=>{
  return jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET!,{
    expiresIn:"1d",
  });
};