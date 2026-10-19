"use client";
import { useEffect, useState } from "react";
import { TicketCheck } from "lucide-react";
import "./admin-promo-card.css";
const api=(process.env.NEXT_PUBLIC_API_URL??"").replace(/\/$/,"");
export default function AdminPromoCard(){const[stats,setStats]=useState({used:0,capacity:100});useEffect(()=>{fetch(`${api}/v1/public/promotion`).then(response=>response.ok?response.json():null).then((data:{used?:number;capacity?:number}|null)=>{if(data)setStats({used:data.used??0,capacity:data.capacity??100})}).catch(()=>null)},[]);return <section className="admin-promo-card"><TicketCheck/><div><span>Usuarios promo</span><strong>{stats.used} <small>de {stats.capacity}</small></strong></div></section>}
