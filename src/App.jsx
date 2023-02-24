import React from "react";
import Routes from "./routes";
import { useAuth } from "./hooks/auth";

export default function App(){
	const { isLogged } = useAuth()
	isLogged()
  	return (
		<Routes/>
  	);
}
