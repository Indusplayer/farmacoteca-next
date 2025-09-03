"use client";
import React, { useEffect, useMemo, useState } from "react";

type Rol = "Lector" | "Revisor" | "Admin";

const DEMO_PROTOCOLS = [
  {
    id: "bicarbonato-sodio",
    categoria: "Líquidos y Electrolitos",
    nombre: "Bicarbonato de Sodio (NaHCO3)",
    presentacion: "Ampolla 10 mL",
    dosis_seguridad: "Según protocolo institucional",
    via_forma: "IV (catéter central o periférico)",
    ph: "7.8–8.5",
    tiempo_administracion: "2–4 horas",
    concentracion: "Según protocolo",
    dilucion: "5 ampollas + 50 mL D5%",
    unidad_dosificacion: "mEq/kg/h",
    incompatibilidades_y: ["Calcio", "Norepinefrina"],
    estabilidad_dilucion: "12 h",
    proteger_luz: false,
    observaciones: ["Usar bomba de infusión", "Monitorizar pH y potasio"],
    backorder: false,
    sinonimos: ["NaHCO3", "Bicarbonato"],
    ultima_actualizacion: "2025-08-20"
  },
  {
    id: "cloruro-potasio",
    categoria: "Líquidos y Electrolitos",
    nombre: "Cloruro de Potasio (KCl)",
    presentacion: "Ampolla 10 mL",
    dosis_seguridad: "Según protocolo institucional",
    via_forma: "IV (preferible central)",
    ph: "4.5–7.0",
    tiempo_administracion: "Infusión controlada",
    concentracion: "Según protocolo",
    dilucion: "Preparación controlada en SSN 0.9%",
    unidad_dosificacion: "mEq/h",
    incompatibilidades_y: ["Amfotericina B"],
    estabilidad_dilucion: "24 h",
    proteger_luz: false,
    observaciones: ["Nunca en bolo", "Monitorizar ECG"],
    backorder: false,
    sinonimos: ["KCl"],
    ultima_actualizacion: "2025-07-09"
  },
  {
    id: "midazolam",
    categoria: "Sedoanalgesia",
    nombre: "Midazolam",
    presentacion: "Ampolla 5 mg/mL",
    dosis_seguridad: "Según protocolo institucional",
    via_forma: "IV/IM",
    ph: "3.0–3.5",
    tiempo_administracion: "Según indicación",
    concentracion: "Según protocolo",
    dilucion: "Dilución estándar",
    unidad_dosificacion: "mg/kg/h",
    incompatibilidades_y: ["Fentanilo (verificar)", "Loratadina"],
    estabilidad_dilucion: "24 h",
    proteger_luz: true,
    observaciones: ["Vigilar depresión respiratoria"],
    backorder: false,
    sinonimos: ["MDZ"],
    ultima_actualizacion: "2025-08-14"
  },
  {
    id: "morfina",
    categoria: "Sedoanalgesia",
    nombre: "Morfina",
    presentacion: "Ampolla 10 mg/mL",
    dosis_seguridad: "Según protocolo institucional",
    via_forma: "IV/SC",
    ph: "2.5–6.5",
    tiempo_administracion: "Según protocolo",
    concentracion: "Según protocolo",
    dilucion: "D5%",
    unidad_dosificacion: "mg/h",
    incompatibilidades_y: ["Diclofenaco (evaluar)", "Heparina"],
    estabilidad_dilucion: "24 h",
    proteger_luz: false,
    observaciones: ["Monitorear sedación y PA"],
    backorder: false,
    sinonimos: ["Morfina Sulfato"],
    ultima_actualizacion: "2025-08-12"
  },
  {
    id: "fentanilo",
    categoria: "Sedoanalgesia",
    nombre: "Fentanilo",
    presentacion: "Ampolla 50 mcg/mL",
    dosis_seguridad: "Según protocolo institucional",
    via_forma: "IV",
    ph: "4–7.5",
    tiempo_administracion: "Según protocolo",
    concentracion: "Según protocolo",
    dilucion: "SSN 0.9%",
    unidad_dosificacion: "mcg/kg/h",
    incompatibilidades_y: ["Ver protocolos de sedoanalgesia"],
    estabilidad_dilucion: "24 h",
    proteger_luz: true,
    observaciones: ["Vigilar depresión respiratoria"],
    backorder: false,
    sinonimos: ["Fentanyl"],
    ultima_actualizacion: "2025-08-01"
  },
  {
    id: "ssn-09",
    categoria: "Líquidos y Electrolitos",
    nombre: "Cloruro de Sodio 0.9% (SSN)",
    presentacion: "Bolsa 1000 mL",
    dosis_seguridad: "Según protocolo institucional",
    via_forma: "IV",
    ph: "4.5–7.0",
    tiempo_administracion: "Según protocolo",
    concentracion: "0.9%",
    dilucion: "N/A",
    unidad_dosificacion: "mL/h",
    incompatibilidades_y: ["N.A."],
    estabilidad_dilucion: "—",
    proteger_luz: false,
    observaciones: ["Solución isotónica"],
    backorder: false,
    sinonimos: ["Suero fisiológico"],
    ultima_actualizacion: "2025-06-21"
  }
];

const CATEGORIES = ["Todas", "Sedoanalgesia", "Líquidos y Electrolitos"];

export default function FarmacotecaApp() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("Todas");
  const [rol, setRol] = useState<Rol>(() => (typeof window !== "undefined" ? (localStorage.getItem("demo_rol") as Rol) : "Lector") || "Lector");
  const [emergencia, setEmergencia] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [tab, setTab] = useState<"consulta" | "drills">("consulta");
  const [data, setData] = useState<any[]>(DEMO_PROTOCOLS);

  useEffect(() => { localStorage.setItem("demo_rol", rol); }, [rol]);
  useEffect(() => {
    fetch("/protocols_normalized.json").then(r => (r.ok ? r.json() : null)).then(j => { if (Array.isArray(j) && j.length) setData(j); }).catch(()=>{});
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((p: any) => {
      const matchQ = q ? (p.nombre?.toLowerCase().includes(q) || (p.sinonimos || []).some((s: string) => s.toLowerCase().includes(q))) : true;
      const matchC = categoria === "Todas" ? true : p.categoria === categoria;
      return matchQ && matchC;
    });
  }, [query, categoria, data]);

  return (
    <div className={`min-h-screen w-full ${emergencia ? "bg-black text-white" : "bg-white text-gray-900"}`}>
      <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-black/50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold">Farmacoteca Digital</span>
            <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">DEMO</span>
          </div>
          <div className="flex items-center gap-2">
            <nav className="flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              {[{id:"consulta", label:"Consulta"},{id:"drills", label:"Drills"}].map((t) => (
                <button key={t.id} onClick={() => setTab(t.id as any)} className={`px-3 py-2 text-sm ${tab===t.id? "bg-indigo-600 text-white":"bg-transparent"}`}>{t.label}</button>
              ))}
            </nav>
            <select value={rol} onChange={(e) => setRol(e.target.value as Rol)} className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 dark:border-gray-700" aria-label="Seleccionar rol">
              <option>Lector</option><option>Revisor</option><option>Admin</option>
            </select>
            <button onClick={() => setEmergencia(v=>!v)} className={`px-3 py-2 rounded-lg border ${emergencia? "bg-red-600 text-white border-red-600":"bg-white dark:bg-gray-900 dark:border-gray-700"}`}>{emergencia? "Modo Normal":"Modo Emergencia"}</button>
          </div>
        </div>
      </header>

      {tab === "consulta" ? (
        <ConsultaView emergencia={emergencia} filtered={filtered} setCategoria={setCategoria} categoria={categoria} setQuery={setQuery} query={query} onOpen={(p:any)=>setSelected(p)} />
      ) : (
        <DrillsView emergencia={emergencia} protocols={data} onOpenProtocol={(p:any)=>{setSelected(p); setTab("consulta");}} />
      )}

      {selected && (
        <FichaModal key={selected.id} p={selected} onClose={() => setSelected(null)} onSave={(updated:any) => {
          setData((prev:any[]) => prev.map((x:any) => (x.id === updated.id ? updated : x)));
          setSelected(updated);
        }} rol={rol} emergencia={emergencia} />
      )}

      <footer className="max-w-6xl mx-auto px-4 py-6 text-xs opacity-70"><p>DEMO — Consulta y Drills. Los datos son demostrativos y no clínicos. La edición guarda localmente.</p></footer>
    </div>
  );
}

function ConsultaView({ emergencia, filtered, categoria, setCategoria, query, setQuery, onOpen }: any) {
  return (
    <main className={`max-w-6xl mx-auto px-4 ${emergencia ? "text-[18px] sm:text-[20px]" : "text-base"}`}>
      <section className="py-4 grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o sinónimo (ej. 'bicarbonato', 'KCl')" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategoria(c)} className={`px-3 py-2 rounded-xl border text-sm ${categoria === c? "bg-indigo-600 text-white border-indigo-600":"bg-white dark:bg-gray-900 dark:border-gray-700"}`}>{c}</button>
          ))}
        </div>
      </section>

      <section className="pb-6 grid gap-3 sm:grid-cols-2">
        {filtered.length === 0 && (<div className="col-span-2 p-6 rounded-xl border border-dashed text-center text-gray-500 dark:border-gray-700">No se encontraron medicamentos. Verifica el nombre.</div>)}
        {filtered.map((p: any) => (
          <article key={p.id} className={`rounded-2xl border p-4 shadow-sm cursor-pointer transition hover:shadow-md ${emergencia ? "border-gray-700" : "border-gray-200"}`} onClick={() => onOpen(p)} role="button" aria-label={`Abrir ${p.nombre}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-lg">{p.nombre}</h3>
                <p className="text-sm opacity-80">{p.presentacion}</p>
              </div>
              <div className="flex items-center gap-2">
                {p.backorder && (<span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200">Backorder</span>)}
                {p.proteger_luz && (<span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200">Fotosensible</span>)}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Tag>Vía: {p.via_forma}</Tag>{p.ph && <Tag>pH: {p.ph}</Tag>}<Tag>Cat: {p.categoria}</Tag>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function buildDrills(protocols:any[]) {
  const items:any[] = [];
  let qid = 1;
  const distractorPool = ["—","No aplica","Heparina","Insulina","Lidocaína"];
  protocols.forEach((rec:any) => {
    if (Array.isArray(rec.incompatibilidades_y) && rec.incompatibilidades_y.length) {
      const correct = rec.incompatibilidades_y[0];
      const opts = Array.from(new Set([correct, ...distractorPool])).slice(0,4);
      items.push({ id: `Q${qid++}`, type: "MCQ", protocol_id: rec.id, question: `Para ${rec.nombre}, ¿cuál es una incompatibilidad en Y?`, options: opts, answer: correct, explain: "Verificar siempre en el protocolo." });
    }
    if (rec.estabilidad_dilucion && rec.estabilidad_dilucion.trim() && rec.estabilidad_dilucion !== "—") {
      items.push({ id: `Q${qid++}`, type: "CLOZE", protocol_id: rec.id, question: `La estabilidad de la dilución de ${rec.nombre} es de __.`, answer: rec.estabilidad_dilucion, explain: "Confirmar condiciones específicas en el protocolo." });
    }
    if (typeof rec.proteger_luz === "boolean") {
      items.push({ id: `Q${qid++}`, type: "TRUE_FALSE", protocol_id: rec.id, question: `${rec.nombre} requiere protección de la luz.`, answer: rec.proteger_luz?"Verdadero":"Falso", explain: "Revisar fotosensibilidad en el protocolo." });
    }
  });
  return items;
}

function ratio(stat:any){ const c = stat?.correct||0, w = stat?.wrong||0; const tot = c+w; if(!tot) return 0; return c/tot; }
function pickSession(items:any[], stats:any, n:number){
  const scored = items.map(it => ({ it, score: ratio(stats[it.id]) }));
  scored.sort((a,b)=>a.score-b.score || a.it.id.localeCompare(b.it.id));
  return scored.slice(0, n).map(s=>s.it);
}

function DrillsView({ emergencia, protocols, onOpenProtocol }: any){
  const [all] = useState<any[]>(()=>buildDrills(protocols));
  const [stats, setStats] = useState<any>(()=>{ try{ return JSON.parse(localStorage.getItem("demo_drill_stats_v1")||"{}"); }catch{ return {}; } });
  const [session, setSession] = useState<any[]>([]);
  const [i, setI] = useState(0);
  const [answered, setAnswered] = useState<any>(null);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);

  useEffect(()=>{ localStorage.setItem("demo_drill_stats_v1", JSON.stringify(stats)); }, [stats]);

  const weak = useMemo(()=>{
    const arr = Object.entries(stats).map(([id,s]:any)=>({id, ...(s as any), r: ratio(s)}));
    arr.sort((a,b)=>a.r-b.r);
    return arr.slice(0,5);
  },[stats]);

  const start = (n=3)=>{
    const pick = pickSession(all, stats, n);
    setSession(pick);
    setI(0);
    setDone(false);
    setAnswered(null);
    setInput("");
  };

  const current = session[i];

  const submit = (value:any)=>{
    if(!current) return;
    let correct = false;
    if(current.type === "MCQ" || current.type === "TRUE_FALSE"){
      correct = String(value).trim().toLowerCase() === String(current.answer).trim().toLowerCase();
    } else if(current.type === "CLOZE"){
      correct = String(input).trim().toLowerCase() === String(current.answer).trim().toLowerCase();
    }
    setAnswered({value, correct});
    setStats((prev:any)=>({ ...prev, [current.id]: { correct: (prev[current?.id]?.correct||0)+(correct?1:0), wrong: (prev[current?.id]?.wrong||0)+(!correct?1:0), last: Date.now() } }));
  };

  const next = ()=>{
    if(i+1 < session.length){ setI(i+1); setAnswered(null); setInput(""); }
    else { setDone(true); }
  };

  const openProto = ()=>{ const p = protocols.find((x:any)=>x.id===current.protocol_id); if(p) onOpenProtocol(p); };

  return (
    <main className={`max-w-6xl mx-auto px-4 ${emergencia?"text-[18px] sm:text-[20px]":"text-base"}`}>
      {!session.length && (
        <section className="py-6 grid gap-4">
          <div className="rounded-2xl border p-4">
            <h2 className="text-xl font-semibold">Protocol Drills</h2>
            <p className="text-sm opacity-80">Entrenamientos de 2–3 minutos. Opt‑in. Refuerza puntos críticos y luego verifica en el protocolo.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={()=>start(3)} className="px-3 py-2 rounded-lg border bg-indigo-600 text-white border-indigo-600">Empezar drill (3)</button>
              <button onClick={()=>start(5)} className="px-3 py-2 rounded-lg border">Empezar drill (5)</button>
            </div>
          </div>
          <div className="rounded-2xl border p-4">
            <h3 className="font-medium">Ítems más débiles</h3>
            <ul className="mt-2 list-disc pl-6 text-sm">
              {weak.length===0 && <li>Sin historial aún.</li>}
              {weak.map((w:any)=> (<li key={w.id} className="opacity-80">{w.id}: {Math.round(w.r*100)}% acierto</li>))}
            </ul>
          </div>
        </section>
      )}

      {!!session.length && !done && current && (
        <section className="py-6">
          <div className="mb-3 text-sm opacity-70">Pregunta {i+1} de {session.length}</div>
          <article className="rounded-2xl border p-4">
            <h3 className="font-medium text-lg">{current.question}</h3>
            <div className="mt-4">
              {current.type === "MCQ" && (
                <div className="grid gap-2">
                  {current.options.map((opt:string) => (
                    <button key={opt} disabled={!!answered} onClick={()=>submit(opt)} className={`px-3 py-2 rounded-lg border text-left ${answered? (String(opt).toLowerCase()===String(current.answer).toLowerCase()?"bg-green-100 border-green-300":"opacity-60") : "hover:bg-gray-50"}`}>{opt}</button>
                  ))}
                </div>
              )}
              {current.type === "TRUE_FALSE" && (
                <div className="flex gap-2">
                  {['Verdadero','Falso'].map((opt:string) => (
                    <button key={opt} disabled={!!answered} onClick={()=>submit(opt)} className={`px-3 py-2 rounded-lg border ${answered? (String(opt).toLowerCase()===String(current.answer).toLowerCase()?"bg-green-100 border-green-300":"opacity-60") : "hover:bg-gray-50"}`}>{opt}</button>
                  ))}
                </div>
              )}
              {current.type === "CLOZE" && (
                <div className="flex gap-2 items-center">
                  <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Respuesta" className="px-3 py-2 rounded-lg border" />
                  <button onClick={()=>submit(input)} disabled={!!answered} className="px-3 py-2 rounded-lg border">Enviar</button>
                </div>
              )}
            </div>

            {answered && (
              <div className="mt-4 p-3 rounded-lg border bg-gray-50 dark:bg-gray-900/40">
                <div className={`font-medium ${answered.correct?"text-green-700":"text-red-700"}`}>{answered.correct?"¡Correcto!":"Respuesta incorrecta"}</div>
                <div className="text-sm mt-1 opacity-80">{current.explain}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={openProto} className="px-3 py-2 rounded-lg border">Verificar en protocolo</button>
                  <button onClick={next} className="px-3 py-2 rounded-lg border bg-indigo-600 text-white border-indigo-600">Siguiente</button>
                </div>
              </div>
            )}
          </article>
        </section>
      )}

      {done && (
        <section className="py-6 grid gap-3">
          <div className="rounded-2xl border p-4">
            <h3 className="font-semibold">¡Drill completado!</h3>
            <div className="mt-3 flex gap-2">
              <button onClick={()=>{setSession([]); setI(0); setDone(false);}} className="px-3 py-2 rounded-lg border">Volver</button>
              <button onClick={()=>{const n=session.length||3; setDone(false); setSession([]); setTimeout(()=>{const pick = pickSession(all, stats, n); setSession(pick); setI(0);}, 0);}} className="px-3 py-2 rounded-lg border bg-indigo-600 text-white border-indigo-600">Repetir</button>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function Tag({ children }: any) { return (<span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200">{children}</span>); }
function Row({ label, children }: any) { return (<div className="grid grid-cols-12 gap-3 py-2"><div className="col-span-12 sm:col-span-4 font-medium">{label}</div><div className="col-span-12 sm:col-span-8">{children}</div></div>); }

function EditableText({ value, onChange, disabled }: any) {
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <div className={`rounded-lg border px-3 py-2 ${disabled ? "bg-gray-50 dark:bg-gray-900/40" : "bg-white dark:bg-gray-900"} ${editing && !disabled ? "ring-2 ring-indigo-500" : ""}`} contentEditable={!disabled && editing} suppressContentEditableWarning onInput={(e:any) => !disabled && onChange(e.target.innerText)} onBlur={() => setEditing(false)}>{value}</div>
      {!disabled && (<div className="mt-1"><button onClick={() => setEditing((v) => !v)} className="text-xs px-2 py-1 rounded-md border">{editing ? "Bloquear" : "Editar"}</button></div>)}
    </div>
  );
}

function FichaModal({ p, onClose, onSave, rol, emergencia }: any) {
  const [local, setLocal] = useState<any>({ ...p });
  const [timerMs, setTimerMs] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || timerMs <= 0) return;
    const id = setInterval(() => setTimerMs((t) => t - 1000), 1000);
    return () => clearInterval(id);
  }, [running, timerMs]);

  useEffect(() => {
    if (timerMs <= 0 && running) {
      setRunning(false);
      try {
        const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext; const ctx = new Ctx();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = 880; o.connect(g); g.connect(ctx.destination); o.start();
        setTimeout(() => { o.stop(); ctx.close(); }, 800);
      } catch {}
      alert("⏱️ Tiempo completado");
    }
  }, [timerMs, running]);

  const canEdit = rol === "Admin" || rol === "Revisor";

  const labels: [string, string][] = [
    ["Medicamento y presentación", "presentacion"],
    ["Dosis de seguridad", "dosis_seguridad"],
    ["Vía y forma de administración", "via_forma"],
    ["Tiempo de administración", "tiempo_administracion"],
    ["Concentración", "concentracion"],
    ["Dilución", "dilucion"],
    ["Unidad de dosificación", "unidad_dosificacion"],
    ["Incompatibilidades en Y", "incompatibilidades_y"],
    ["Estabilidad de la dilución", "estabilidad_dilucion"],
    ["Proteger de la luz", "proteger_luz"],
    ["Observaciones", "observaciones"],
  ];

  const startTimer = () => {
    const input = prompt("Minutos para temporizador (numérico)");
    if (!input) return;
    const mins = Number(input);
    if (Number.isFinite(mins) && mins > 0) { setTimerMs(mins * 60 * 1000); setRunning(true); }
  };

  const fmt = (ms:number) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const r = String(s % 60).padStart(2, "0");
    return `${m}:${r}`;
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className={`w-full max-w-3xl rounded-2xl ${emergencia ? "bg-black text-white border border-gray-700" : "bg-white text-gray-900"} p-4 sm:p-6 max-h-[85vh] overflow-auto`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{local.nombre}</h2>
            <div className="mt-1 flex flex-wrap gap-2">
              <Tag>Cat: {local.categoria}</Tag>
              {local.backorder && <Tag>Backorder</Tag>}
              {local.proteger_luz && <Tag>Fotosensible</Tag>}
              {local.ph && <Tag>pH: {local.ph}</Tag>}
              <Tag>Últ. act.: {local.ultima_actualizacion}</Tag>
            </div>
          </div>
          <button onClick={onClose} className="px-3 py-2 rounded-lg border">Cerrar</button>
        </div>

        <div className="mt-4">
          {labels.map(([label, key]) => (
            <Row key={key} label={label}>
              {key === "proteger_luz" ? (
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={!!(local as any)[key]} onChange={(e) => setLocal({ ...local, [key]: e.target.checked })} disabled={!canEdit} />
                  <span>{(local as any)[key] ? "Sí" : "No"}</span>
                </div>
              ) : key === "incompatibilidades_y" || key === "observaciones" ? (
                <EditableText value={(local as any)[key]?.join?.("; ") || ""} onChange={(v:string) => setLocal({ ...local, [key]: v.split(/;\s*/).filter(Boolean) })} disabled={!canEdit} />
              ) : (
                <EditableText value={(local as any)[key] ?? ""} onChange={(v:string) => setLocal({ ...local, [key]: v })} disabled={!canEdit} />
              )}
            </Row>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button onClick={() => { navigator.clipboard.writeText(`# ${local.nombre}\n\n` + `Presentación: ${local.presentacion}\n` + `Vía/forma: ${local.via_forma} (pH ${local.ph || "N/D"})\n` + `Tiempo: ${local.tiempo_administracion}\n` + `Concentración: ${local.concentracion}\n` + `Dilución: ${local.dilucion}\n` + `Unidad: ${local.unidad_dosificacion}\n` + `Incompatibilidades en Y: ${(local.incompatibilidades_y || []).join(", ")}\n` + `Estabilidad: ${local.estabilidad_dilucion}\n` + `Fotosensible: ${local.proteger_luz ? "Sí" : "No"}\n` + `Observaciones: ${(local.observaciones || []).join("; ")}` ); }} className="px-3 py-2 rounded-lg border" title="Copiar ficha">Copiar</button>
          <button onClick={startTimer} className="px-3 py-2 rounded-lg border">Iniciar temporizador</button>
          {timerMs > 0 && (<div className="ml-2 text-lg font-mono">⏱️ {fmt(timerMs)}</div>)}
          {(rol === "Admin" || rol === "Revisor") && (<button onClick={() => onSave(local)} className="px-3 py-2 rounded-lg border bg-indigo-600 text-white border-indigo-600">Guardar cambios</button>)}
        </div>

        {(rol === "Admin" || rol === "Revisor") && (
          <details className="mt-4">
            <summary className="cursor-pointer font-medium">Campos adicionales</summary>
            <div className="mt-2 grid gap-2">
              <Row label="Sinónimos"><EditableText value={(local.sinonimos || []).join(", ")} onChange={(v:string) => setLocal({ ...local, sinonimos: v.split(/,\s*/).filter(Boolean) })} /></Row>
              <Row label="Última actualización"><EditableText value={local.ultima_actualizacion || ""} onChange={(v:string) => setLocal({ ...local, ultima_actualizacion: v })} /></Row>
              <Row label="Backorder"><div className="flex items-center gap-2"><input type="checkbox" checked={!!local.backorder} onChange={(e) => setLocal({ ...local, backorder: e.target.checked })} /><span>{local.backorder ? "Sí" : "No"}</span></div></Row>
              <Row label="pH"><EditableText value={local.ph || ""} onChange={(v:string) => setLocal({ ...local, ph: v })} /></Row>
              <Row label="Categoría"><EditableText value={local.categoria} onChange={(v:string) => setLocal({ ...local, categoria: v })} /></Row>
            </div>
          </details>
        )}

        <div className="mt-6 text-xs opacity-70"><p>DEMO — Edición local. En producción: cambios versionados y revisión por pares.</p></div>
      </div>
    </div>
  );
}
