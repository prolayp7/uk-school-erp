"use client";
import { useMemo, useSyncExternalStore } from "react";
import { PARENTS, type ParentContact } from "@/lib/parents-data";
const STORAGE_KEY="school-parents-demo-v1";
const EVENT="school-parents-updated";
function subscribe(callback:()=>void){window.addEventListener("storage",callback);window.addEventListener(EVENT,callback);return()=>{window.removeEventListener("storage",callback);window.removeEventListener(EVENT,callback);};}
function snapshot(){try{return localStorage.getItem(STORAGE_KEY)||"";}catch{return "";}}
export function useParents(){
  const raw=useSyncExternalStore(subscribe,snapshot,()=>"");
  const ready=useSyncExternalStore(subscribe,()=>true,()=>false);
  const contacts=useMemo<ParentContact[]>(()=>{try{const data=JSON.parse(raw);if(Array.isArray(data)&&data.every(c=>c&&typeof c.id==="string"&&typeof c.name==="string"&&Array.isArray(c.links)&&Array.isArray(c.events)))return data;}catch{}return PARENTS;},[raw]);
  function save(next:ParentContact[]){localStorage.setItem(STORAGE_KEY,JSON.stringify(next));window.dispatchEvent(new Event(EVENT));}
  return {contacts,save,ready};
}
