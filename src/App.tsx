import { useState, useEffect, useRef, useCallback } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import {
  Home, Thermometer, Droplets, Wind, Zap, Beaker,
  Mic, Image as ImageIcon, Send, Power, Edit2, X, CalendarDays, Clock,
  Bot, Droplet, FlaskConical, Waves, Timer, ShieldAlert, ScanSearch, Calculator,
  Activity, MonitorPlay, Fan, Layers, Box,
  ChevronDown, ChevronUp
} from "lucide-react";

// ============================================================================
// 1. GLOBAL DICTIONARIES & HELPER FUNCTIONS
// ============================================================================
const t = {
  th: {
    brand: "THE PLANT FACTORY เวียงจันทน์", dashboard: "แดชบอร์ด", harvestTab: "เก็บเกี่ยว", commandCenter: "ศูนย์บัญชาการฟาร์ม", controls: "ควบคุม", aiAssistant: "Monday AI", settings: "ตั้งค่า", lighting: "ระบบแสง (16 โซน)", fertigation: "ระบบปรุงปุ๋ยและจัดการ PH", climate: "สภาพอากาศ", kale: "ผักเคล", salad: "ผักสลัด", bellPepper: "พริกหยวก", cucumber: "แตงกวาญี่ปุ่น", seedling: "ต้นกล้า", rack: "แร็คที่", shelf: "ชั้นที่", growth: "การ\nเติบโต", days: "วัน", editPlanting: "แก้ไขวันปลูก", plantDate: "วันที่เริ่มปลูก", targetAge: "รอบปลูก", distribute: "ระบบจ่ายปุ๋ย (5 โซน)", fertNote: "คลิกเลือกชนิดพืชที่คุณต้องการปลูก ระบบจะแนะนำปริมาณปุ๋ยที่เหมาะสม", welcomeTH: "ต้อนรับ (TH)", welcomeLA: "ต้อนรับ (LA)", zone1: "ชั้นปลูกที่ 1", zone2: "ชั้นปลูกที่ 2", zone3: "ชั้นปลูกที่ 3", zone4: "ชั้นปลูกพริกหยวก", zone5: "ชั้นปลูกแตงกวาญี่ปุ่น", pumpA: "เติมปุ๋ย A", pumpB: "เติมปุ๋ย B", acid: "เติม PH ลด", base: "เติม PH เพิ่ม", water: "เติมน้ำเปล่า", stir: "ปั๊มกวนผสม", systemMetrics: "พารามิเตอร์ระบบ", backToSim: "กลับสู่หน้าจำลองแร็ค", harvestSchedule: "ตารางรอบการเก็บเกี่ยว", plantType: "ชนิดพืช", status: "สถานะ", readyToHarvest: "พร้อมเก็บเกี่ยว", nearHarvest: "ใกล้เก็บเกี่ยว", growing: "กำลังเจริญเติบโต", chatPlaceholder: "พิมพ์สั่งการ Monday AI..."
  },
  la: {
    brand: "THE PLANT FACTORY ວຽງຈັນ", dashboard: "ແດຊບອດ", harvestTab: "ເກັບກ່ຽວ", commandCenter: "ສູນບັນຊາການຟາມ", controls: "ຄວບຄຸມ", aiAssistant: "Monday AI", settings: "ຕັ້ງຄ່າ", lighting: "ລະບົບແສງ (16 ໂຊນ)", fertigation: "ລະບົບປຸ໋ຍ ແລະ ຈັດການ PH", climate: "ສະພາບອາກາດ", kale: "ຜັກເຄລ", salad: "ຜັກສະລັດ", bellPepper: "ໝາກເຜັດໃຫຍ່", cucumber: "ໝາກແຕງຍີ່ປຸ່ນ", seedling: "ເບ້ຍໄມ້", rack: "ຊັ້ນປູກທີ", shelf: "ຊັ້ນທີ", growth: "ການ\nເຕີບໂຕ", days: "ມື້", editPlanting: "ແກ້ໄຂວັນປູກ", plantDate: "ວັນທີເລີ່ມປູກ", targetAge: "ຮອບປູກ", distribute: "ລະບົບຈ່າຍປຸ໋ຍ (5 ໂຊນ)", fertNote: "ຄລິກເລືອກຊະນິດພືດທີ່ຕ້ອງການປູກ ລະບົບຈະແນະນຳປະລິມານປຸ໋ຍທີ່ເໝາະສົມ", welcomeTH: "ຕ້ອນຮັບ (TH)", welcomeLA: "ຕ້ອນຮັບ (LA)", zone1: "ຊັ້ນປູກທີ 1", zone2: "ຊັ້ນປູກທີ 2", zone3: "ຊັ້ນປູກທີ 3", zone4: "ຊັ້ນປູກໝາກເຜັດໃຫຍ່", zone5: "ຊັ້ນປູກໝາກແຕງຍີ່ປຸ່ນ", pumpA: "ຕື່ມປຸ໋ຍ A", pumpB: "ຕື່ມປຸ໋ຍ B", acid: "ຕື່ມ PH ລົດ", base: "ຕື່ມ PH ເພີ່ມ", water: "ຕື່ມນ້ຳເປົ່າ", stir: "ປ້ຳກວນປະສົມ", systemMetrics: "ພາຣາມິເຕີລະບົບ", backToSim: "ກັບສູ່ໜ້າຈຳລອງ", harvestSchedule: "ຕາຕະລາງຮອບເກັບກ່ຽວ", plantType: "ຊະນິດພືດ", status: "ສະຖານະ", readyToHarvest: "ພ້ອມເກັບກ່ຽວ", nearHarvest: "ໃກ້ເກັບກ່ຽວ", growing: "ກຳລັງຈະເລີນເຕີບໂຕ", chatPlaceholder: "ພິມສັ່ງການ Monday AI..."
  },
  en: {
    brand: "THE PLANT FACTORY VIENTIANE", dashboard: "Dashboard", harvestTab: "Harvest", commandCenter: "Command Center", controls: "Controls", aiAssistant: "Monday AI", settings: "Settings", lighting: "Lighting (16 Zones)", fertigation: "Fertigation & pH System", climate: "Climate", kale: "Kale", salad: "Salad", bellPepper: "Bell Pepper", cucumber: "Cucumber", seedling: "Seedling", rack: "Rack", shelf: "Shelf", growth: "Growth", days: "Days", editPlanting: "Edit Planting", plantDate: "Plant Date", targetAge: "Cycle", distribute: "Distribution (5 Zones)", fertNote: "Select plant type for optimal nutrient recommendation", welcomeTH: "Welcome (TH)", welcomeLA: "Welcome (LA)", zone1: "Grow Shelf 1", zone2: "Grow Shelf 2", zone3: "Grow Shelf 3", zone4: "Bell Pepper Shelf", zone5: "Cucumber Shelf", pumpA: "Add Fert A", pumpB: "Add Fert B", acid: "pH Down", base: "pH Up", water: "Add Water", stir: "Mixing Pump", systemMetrics: "System Metrics", backToSim: "Back to Simulator", harvestSchedule: "Harvest Schedule Table", plantType: "Plant Type", status: "Status", readyToHarvest: "Ready to Harvest", nearHarvest: "Near Harvest", growing: "Growing", chatPlaceholder: "Message Monday AI..."
  }
} as const;

type Language = keyof typeof t;

type RackRecipe = {
  EC: string;
  A: string;
  B: string;
};

type RackShelf = {
  level: number;
  zone: number;
  plantDate: string;
  target: number;
};

type RackData = {
  id: string;
  plant: string;
  icon: string;
  recipe: RackRecipe;
  shelves: RackShelf[];
};

type PlantCatalogEntry = {
  name: string;
  icon: string;
  recipe: RackRecipe;
};

type SensorData = {
  temp: number;
  humidity: number;
  ph: number;
  ec: number;
  co2: number;
  do: number;
};

type PumpState = {
  a: boolean;
  b: boolean;
  acid: boolean;
  base: boolean;
  water: boolean;
  stir: boolean;
};

type DistZoneState = {
  z1: boolean;
  z2: boolean;
  z3: boolean;
  z4: boolean;
  z5: boolean;
};

type ClimateState = {
  ac: boolean;
  dehumidifier: boolean;
  co2: boolean;
  fan: boolean;
};

type ChatMessage = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

type EditModalState = {
  isOpen: boolean;
  rackId: string | null;
  zone: number | null;
  plant: string;
  recipe: RackRecipe;
  plantDate: string;
  target: number;
  title: string;
};

type LegacyShelf = Partial<RackShelf>;

type LegacyRack = {
  id?: string | number;
  plant?: string;
  typeKey?: string;
  recipe?: Partial<RackRecipe>;
  shelves?: LegacyShelf[];
};

const RACKS_STORAGE_KEY = "plant-factory-control-panel-racks";
const PLANT_CATALOG_STORAGE_KEY = "plant-factory-plant-catalog";
const LANG_OPTIONS: Language[] = ["en", "th", "la"];
const MAX_PLANT_TYPES = 6;

const PLANT_ICON_MAP: Record<string, string> = {
  lettuce: "🥬",
  kale: "🥬",
  spinach: "🌿",
  "wild rocket": "🌿",
  "crystal ice plant": "🧊",
};

const normalizePlantName = (plant: string) => plant.trim().replace(/\s+/g, " ").toLowerCase();
const cleanPlantName = (plant: string) => plant.trim().replace(/\s+/g, " ");
const normalizeRecipe = (recipe?: Partial<RackRecipe>, fallback: RackRecipe = { EC: "1.8", A: "5", B: "5" }): RackRecipe => ({
  EC: String(recipe?.EC ?? fallback.EC),
  A: String(recipe?.A ?? fallback.A),
  B: String(recipe?.B ?? fallback.B),
});
const getPlantIcon = (plant: string) => PLANT_ICON_MAP[normalizePlantName(plant)] || "🪴";

const getRackNumber = (rackId: string) => rackId.replace("rack-", "");

const buildDefaultPlantCatalog = (): PlantCatalogEntry[] => [
  { name: "Kale", icon: getPlantIcon("Kale"), recipe: { EC: "1.8", A: "5", B: "5" } },
  { name: "Lettuce", icon: getPlantIcon("Lettuce"), recipe: { EC: "1.6", A: "4", B: "4" } },
  { name: "Spinach", icon: getPlantIcon("Spinach"), recipe: { EC: "1.7", A: "4.5", B: "4.5" } },
  { name: "Wild Rocket", icon: getPlantIcon("Wild Rocket"), recipe: { EC: "1.9", A: "5", B: "5" } },
  { name: "Crystal Ice Plant", icon: getPlantIcon("Crystal Ice Plant"), recipe: { EC: "1.4", A: "3", B: "3" } },
];

const normalizePlantCatalog = (input: unknown): PlantCatalogEntry[] => {
  const source = Array.isArray(input) ? input : buildDefaultPlantCatalog();
  const deduped: PlantCatalogEntry[] = [];
  const seen = new Set<string>();

  for (const item of source) {
    if (typeof item !== "object" || item === null) continue;
    const entry = item as Partial<PlantCatalogEntry>;
    const name = cleanPlantName(String(entry.name ?? ""));
    if (!name) continue;

    const key = normalizePlantName(name);
    if (seen.has(key)) continue;

    deduped.push({
      name,
      icon: getPlantIcon(name),
      recipe: normalizeRecipe(entry.recipe),
    });
    seen.add(key);

    if (deduped.length === MAX_PLANT_TYPES) break;
  }

  return deduped.length > 0 ? deduped : buildDefaultPlantCatalog();
};

const findPlantInCatalog = (catalog: PlantCatalogEntry[], plantName: string) =>
  catalog.find((entry) => normalizePlantName(entry.name) === normalizePlantName(plantName));

const ensureCatalogCoversRacks = (catalog: PlantCatalogEntry[], racks: RackData[]) => {
  const nextCatalog = [...catalog];

  for (const rack of racks) {
    const rackPlant = cleanPlantName(rack.plant);
    if (!rackPlant || findPlantInCatalog(nextCatalog, rackPlant)) continue;
    if (nextCatalog.length === MAX_PLANT_TYPES) break;

    nextCatalog.push({
      name: rackPlant,
      icon: getPlantIcon(rackPlant),
      recipe: normalizeRecipe(rack.recipe),
    });
  }

  return normalizePlantCatalog(nextCatalog);
};

const syncRacksWithPlantCatalog = (racks: RackData[], catalog: PlantCatalogEntry[]) =>
  racks.map((rack) => {
    const plantEntry = findPlantInCatalog(catalog, rack.plant);

    if (!plantEntry) {
      const cleanedPlant = cleanPlantName(rack.plant);
      return {
        ...rack,
        plant: cleanedPlant,
        icon: getPlantIcon(cleanedPlant),
        recipe: normalizeRecipe(rack.recipe),
      };
    }

    return {
      ...rack,
      plant: plantEntry.name,
      icon: plantEntry.icon,
      recipe: { ...plantEntry.recipe },
    };
  });

const deriveActivePlants = (racks: RackData[], catalog: PlantCatalogEntry[]) => {
  const activePlants: PlantCatalogEntry[] = [];
  const seen = new Set<string>();

  for (const rack of racks) {
    const plantEntry = findPlantInCatalog(catalog, rack.plant);
    if (!plantEntry) continue;

    const key = normalizePlantName(plantEntry.name);
    if (seen.has(key)) continue;

    seen.add(key);
    activePlants.push(plantEntry);
  }

  return activePlants;
};

const buildDefaultRacksData = (): RackData[] => [
  {
    id: "rack-1",
    plant: "Kale",
    icon: getPlantIcon("Kale"),
    recipe: { EC: "1.8", A: "5", B: "5" },
    shelves: [
      { level: 5, zone: 4, plantDate: "2026-01-10", target: 45 },
      { level: 4, zone: 3, plantDate: "2026-01-15", target: 45 },
      { level: 3, zone: 2, plantDate: "2026-01-20", target: 45 },
      { level: 2, zone: 1, plantDate: "2026-01-28", target: 45 },
      { level: 1, zone: 0, plantDate: "2026-02-10", target: 45 },
    ],
  },
  {
    id: "rack-2",
    plant: "Lettuce",
    icon: getPlantIcon("Lettuce"),
    recipe: { EC: "1.6", A: "4", B: "4" },
    shelves: [
      { level: 5, zone: 9, plantDate: "2026-01-12", target: 45 },
      { level: 4, zone: 8, plantDate: "2026-01-18", target: 45 },
      { level: 3, zone: 7, plantDate: "2026-01-25", target: 45 },
      { level: 2, zone: 6, plantDate: "2026-02-02", target: 45 },
      { level: 1, zone: 5, plantDate: "2026-02-12", target: 45 },
    ],
  },
  {
    id: "rack-3",
    plant: "Spinach",
    icon: getPlantIcon("Spinach"),
    recipe: { EC: "1.7", A: "4.5", B: "4.5" },
    shelves: [
      { level: 3, zone: 12, plantDate: "2026-01-20", target: 30 },
      { level: 2, zone: 11, plantDate: "2026-01-15", target: 60 },
      { level: 1, zone: 10, plantDate: "2026-02-15", target: 15 },
    ],
  },
];

const getLegacyPlantName = (rack: LegacyRack | undefined, fallbackPlant: string) => {
  const typeMap: Record<string, string> = {
    kale: "Kale",
    salad: "Lettuce",
    seedling: "Basil",
    cucumber: "Pak Choi",
    bellPepper: "Strawberry",
  };

  if (typeof rack?.plant === "string" && rack.plant.trim()) return rack.plant;
  if (typeof rack?.typeKey === "string" && typeMap[rack.typeKey]) return typeMap[rack.typeKey];
  return fallbackPlant;
};

const normalizeRackData = (input: unknown): RackData[] => {
  const defaults = buildDefaultRacksData();
  if (!Array.isArray(input)) return defaults;

  return defaults.map((defaultRack, index) => {
    const savedRack = input.find((item): item is LegacyRack => {
      if (typeof item !== "object" || item === null) return false;
      const rack = item as LegacyRack;
      return rack.id === defaultRack.id || rack.id === index + 1;
    });
    const plant = getLegacyPlantName(savedRack, defaultRack.plant);
    const recipe = {
      EC: String(savedRack?.recipe?.EC ?? defaultRack.recipe.EC),
      A: String(savedRack?.recipe?.A ?? defaultRack.recipe.A),
      B: String(savedRack?.recipe?.B ?? defaultRack.recipe.B),
    };

    const shelves = Array.isArray(savedRack?.shelves) && savedRack.shelves.length > 0
      ? savedRack.shelves.map((shelf: LegacyShelf, shelfIndex: number) => ({
          level: Number(shelf?.level ?? defaultRack.shelves[shelfIndex]?.level ?? shelfIndex + 1),
          zone: Number(shelf?.zone ?? defaultRack.shelves[shelfIndex]?.zone ?? shelfIndex),
          plantDate: String(shelf?.plantDate ?? defaultRack.shelves[shelfIndex]?.plantDate ?? ""),
          target: Number(shelf?.target ?? defaultRack.shelves[shelfIndex]?.target ?? 0),
        }))
      : defaultRack.shelves;

    return {
      id: defaultRack.id,
      plant,
      icon: getPlantIcon(plant),
      recipe,
      shelves,
    };
  });
};

const loadInitialPlantFactoryState = () => {
  if (typeof window === "undefined") {
    const defaultCatalog = buildDefaultPlantCatalog();
    const defaultRacks = syncRacksWithPlantCatalog(buildDefaultRacksData(), defaultCatalog);
    return { plantCatalog: defaultCatalog, racksData: defaultRacks };
  }

  try {
    const savedRacks = normalizeRackData(JSON.parse(window.localStorage.getItem(RACKS_STORAGE_KEY) ?? "null"));
    const savedCatalog = normalizePlantCatalog(JSON.parse(window.localStorage.getItem(PLANT_CATALOG_STORAGE_KEY) ?? "null"));
    const plantCatalog = ensureCatalogCoversRacks(savedCatalog, savedRacks);
    return {
      plantCatalog,
      racksData: syncRacksWithPlantCatalog(savedRacks, plantCatalog),
    };
  } catch (error) {
    console.error("Failed to load plant factory state", error);
    const defaultCatalog = buildDefaultPlantCatalog();
    const defaultRacks = syncRacksWithPlantCatalog(buildDefaultRacksData(), defaultCatalog);
    return { plantCatalog: defaultCatalog, racksData: defaultRacks };
  }
};

const renderIcon = (name: string, size: number = 20, className: string = "") => {
  const icons: Record<string, typeof Activity> = { Layers, Box, Fan, Thermometer, Droplets, Wind, Zap, Beaker, FlaskConical, ShieldAlert, Droplet, Waves, Activity, Power, ScanSearch, Clock, Calculator, Timer };
  const IconComponent = icons[name] || Activity;
  return <IconComponent size={size} className={className} />;
};

const calculateAge = (dateStr: string) => {
  if (!dateStr) return 0;
  const d = new Date(dateStr), today = new Date();
  d.setHours(0,0,0,0); today.setHours(0,0,0,0);
  if (today < d) return 0;
  return Math.ceil(Math.abs(today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)) + 1;
};

// ============================================================================
// 2. MODULAR COMPONENTS
// ============================================================================

const TopMetricsPanel = ({ sensorData }: { sensorData: SensorData }) => (
  <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 w-full shrink-0">
    {[
      { ic: 'Zap', title: "EC (System)", val: sensorData.ec, unit: "mS/cm", col: "text-yellow-400" },
      { ic: 'Beaker', title: "PH System", val: sensorData.ph, unit: "pH", col: "text-pink-400" },
      { ic: 'Thermometer', title: "Temp", val: sensorData.temp, unit: "°C", col: "text-red-400" },
      { ic: 'Droplets', title: "Humidity", val: sensorData.humidity, unit: "%", col: "text-blue-400" },
      { ic: 'Wind', title: "CO2", val: sensorData.co2, unit: "ppm", col: "text-teal-400" },
      { ic: 'Waves', title: "DO (Oxygen)", val: sensorData.do, unit: "mg/L", col: "text-cyan-400" } 
    ].map((m, i) => (
      <div key={i} className="bg-slate-800/80 p-3 md:p-4 rounded-xl md:rounded-2xl flex flex-col items-center justify-center border border-slate-700 shadow-lg backdrop-blur-sm">
        {renderIcon(m.ic, 24, `mb-2 ${m.col}`)}
        <span className="text-gray-400 text-[9px] md:text-[10px] mb-1 font-bold uppercase tracking-widest leading-none text-center">{m.title}</span>
        <div className="flex items-baseline gap-1 font-black">
          <span className="text-xl md:text-2xl text-white font-black">{m.val}</span>
          <span className="text-gray-500 text-[9px] md:text-[10px] font-bold">{m.unit}</span>
        </div>
      </div>
    ))}
  </div>
);

const RacksDisplay = ({ racksData, lights, handleShelfClick, setEditModal, handleToggleLight, lang }: { racksData: RackData[]; lights: boolean[]; handleShelfClick: (rackId: string, shelfLevel: number, plant: string) => void; setEditModal: Dispatch<SetStateAction<EditModalState>>; handleToggleLight: (zone: number) => void; lang: Language; }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
    {racksData.map((rack) => (
      <div key={rack.id} className="bg-slate-800/80 border-2 border-slate-700 rounded-2xl p-4 shadow-xl flex flex-col min-h-[520px]">
        <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2 text-white shrink-0">
          <div>
            <h2 className="text-lg md:text-xl font-black">{t[lang].rack} {getRackNumber(rack.id)}</h2>
            <span className="text-[9px] md:text-[10px] text-emerald-400 font-bold uppercase tracking-widest leading-none">{rack.plant}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-2xl">
            <span aria-hidden="true">{rack.icon}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 flex-1 h-full">
          {rack.shelves.map((shelf) => {
            const isOn = lights[shelf.zone];
            const age = calculateAge(shelf.plantDate);
            const pct = Math.min((age / shelf.target) * 100, 100);
            return (
              <div key={shelf.zone} onClick={() => handleShelfClick(rack.id, shelf.level, rack.plant)} className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 relative overflow-hidden flex flex-col gap-2 group hover:border-emerald-500 transition-all cursor-pointer shadow-inner flex-1 justify-center">
                <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-500 ${isOn ? "bg-purple-500 shadow-[0_0_15px_#a855f7]" : "bg-transparent"}`} />
                <div className="flex justify-between items-center z-10 text-white font-black uppercase">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg ${isOn ? "bg-slate-800 shadow-[0_0_5px_rgba(168,85,247,0.3)]" : "bg-slate-800/50"}`}>
                      <span aria-hidden="true">{rack.icon}</span>
                    </div>
                    <div>
                      <div className="text-[11px] md:text-[13px] font-black uppercase">{t[lang].shelf} {shelf.level} <span className="text-gray-500 font-normal">(โซน {shelf.zone + 1})</span></div>
                      <div className="text-[9px] md:text-[10px] text-gray-400 font-medium leading-none">{rack.plant}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setEditModal({ isOpen: true, rackId: rack.id, zone: shelf.zone, plant: rack.plant, recipe: { ...rack.recipe }, plantDate: shelf.plantDate, target: shelf.target, title: `${t[lang].rack} ${getRackNumber(rack.id)} - ${t[lang].shelf} ${shelf.level}` }); }} className="p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white border border-slate-700 transition-colors shadow-sm"><Edit2 size={12} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleToggleLight(shelf.zone); }} className={`p-1.5 rounded-full transition-all ${isOn ? "bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_#eab308]" : "bg-slate-800 text-gray-600"}`}><Power size={14} /></button>
                  </div>
                </div>
                <div className="flex flex-col z-10 w-full mt-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[7px] md:text-[8px] text-gray-300 font-black leading-tight flex-shrink-0 w-8">{t[lang].growth}</div>
                    <div className="flex-1 h-3 md:h-3.5 bg-slate-800 rounded-full overflow-hidden relative border border-slate-700/50">
                      <div className={`h-full transition-all duration-1000 ${age >= shelf.target ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : age >= shelf.target - 5 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-[10px] md:text-[11px] text-emerald-400 font-black w-8 md:w-10 text-right">{Math.round(pct)}%</div>
                  </div>
                  <div className="flex justify-end mt-0.5"><span className="text-[9px] md:text-[10px] text-white font-black">{age}/{shelf.target} <span className="text-gray-500 text-[7px] md:text-[8px] font-bold">{t[lang].days}</span></span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

const LightingControl = ({ lights, handleToggleLight, lang, isDesktop }: { lights: boolean[]; handleToggleLight: (zone: number) => void; lang: Language; isDesktop: boolean; }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-lg p-4 md:p-5 shrink-0 flex flex-col">
      <button onClick={() => !isDesktop && setIsOpen(!isOpen)} className={`w-full flex justify-between items-center text-white font-black mb-4 ${isDesktop ? 'cursor-default' : ''}`}>
        <div className="flex items-center gap-2 text-sm uppercase"><Zap size={18} className="text-yellow-400" /> {t[lang].lighting}</div>
        {!isDesktop && (isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>)}
      </button>
      {isOpen && (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 bg-slate-900/50 p-3 rounded-lg">
          {lights.map((isOn: boolean, idx: number) => (
            <button key={idx} onClick={() => handleToggleLight(idx)} className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all border-2 ${isOn ? "bg-purple-800/60 border-purple-400 text-white shadow-lg" : "bg-slate-800 border-slate-700 text-gray-500"}`}>
              <Power size={28} className={`md:w-8 md:h-8 ${isOn ? "animate-pulse" : ""}`} />
              <span className="text-[9px] md:text-[10px] mt-1 font-black leading-tight">Z {idx + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FertigationControl = ({ activePlants, updatePlantRecipe, pumps, handleTogglePump, distZones, handleToggleDist, lang, isDesktop }: { activePlants: PlantCatalogEntry[]; updatePlantRecipe: (plantName: string, field: keyof RackRecipe, value: string) => void; pumps: PumpState; handleTogglePump: (key: keyof PumpState, label: string) => void; distZones: DistZoneState; handleToggleDist: (key: keyof DistZoneState, label: string) => void; lang: Language; isDesktop: boolean; }) => {
  const [isOpen, setIsOpen] = useState(true);
  const pumpButtons: { id: keyof PumpState; label: string; ic: string; col: string }[] = [
    { id: "a", label: t[lang].pumpA, ic: "FlaskConical", col: "emerald" },
    { id: "b", label: t[lang].pumpB, ic: "FlaskConical", col: "purple" },
    { id: "acid", label: t[lang].acid, ic: "ShieldAlert", col: "pink" },
    { id: "base", label: t[lang].base, ic: "Droplet", col: "indigo" },
    { id: "water", label: t[lang].water, ic: "Waves", col: "blue" },
    { id: "stir", label: t[lang].stir, ic: "Activity", col: "teal" },
  ];
  const zoneButtons: { k: keyof DistZoneState; l: string; i: string }[] = [
    { k: "z1", l: t[lang].zone1, i: "Layers" },
    { k: "z2", l: t[lang].zone2, i: "Layers" },
    { k: "z3", l: t[lang].zone3, i: "Layers" },
    { k: "z4", l: t[lang].zone4, i: "Box" },
    { k: "z5", l: t[lang].zone5, i: "Box" },
  ];
  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-2xl p-4 md:p-5 flex-1 flex flex-col text-white font-black">
      <button onClick={() => !isDesktop && setIsOpen(!isOpen)} className={`w-full flex justify-between items-center text-blue-400 font-black mb-1 ${isDesktop ? 'cursor-default' : ''}`}>
        <div className="flex items-center gap-3 text-base md:text-lg uppercase"><Beaker size={22} /> {t[lang].fertigation}</div>
        {!isDesktop && (isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>)}
      </button>
      {isOpen && (
        <>
          <p className="text-[9px] md:text-[10px] text-gray-400 mb-4 md:mb-6 font-medium normal-case">{t[lang].fertNote}</p>
          <div className="grid grid-cols-1 gap-3 md:gap-4 mb-6 shrink-0">
            {activePlants.map((plant) => (
              <div key={normalizePlantName(plant.name)} className="bg-slate-900/90 rounded-2xl p-4 md:p-5 border-2 border-slate-700 shadow-inner relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 text-blue-400 tracking-widest text-[9px] md:text-[11px]">
                  <div className="flex items-center gap-1.5 md:gap-2"><Calculator size={14} /> Active Plant Recipe</div>
                  <div className="flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-2 md:px-3 py-1 text-[10px] md:text-xs">
                    <span aria-hidden="true" className="text-base">{plant.icon}</span>
                    <span>{plant.name}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-3 text-center">
                    {[
                      { key: "EC", label: "EC", color: "text-yellow-400" },
                      { key: "A", label: "A", color: "text-emerald-400" },
                      { key: "B", label: "B", color: "text-purple-400" },
                    ].map((field) => (
                      <div key={field.key} className="flex flex-col items-center rounded-xl border border-slate-700 bg-slate-800 p-2">
                        <label className="mb-1 text-[8px] md:text-[10px] text-gray-500 font-black">{field.label}</label>
                        <input
                          type="text"
                          inputMode="decimal"
                          value={plant.recipe[field.key as keyof RackRecipe]}
                          onChange={(event) => updatePlantRecipe(plant.name, field.key as keyof RackRecipe, event.target.value)}
                          className={`w-full bg-transparent text-center text-lg md:text-2xl ${field.color} outline-none`}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8 shrink-0">
              {pumpButtons.map((btn) => (
              <div key={btn.id} onClick={() => handleTogglePump(btn.id, btn.label)} className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${pumps[btn.id] ? `bg-${btn.col}-900/30 border-${btn.col}-500 shadow-md` : "bg-slate-900/40 border-slate-700 hover:bg-slate-800"}`}>
                <div className="flex flex-col gap-1 text-white">{renderIcon(btn.ic, 18, pumps[btn.id] ? `text-${btn.col}-400` : 'text-gray-400')}<span className="text-[11px] md:text-[15px] font-black leading-none">{btn.label}</span></div>
                <div className={`w-8 md:w-10 h-4 md:h-5 rounded-full relative transition-colors ${pumps[btn.id] ? `bg-${btn.col}-500` : "bg-slate-600"}`}><div className={`absolute top-0.5 w-3 md:w-4 h-3 md:h-4 rounded-full bg-white transition-all ${pumps[btn.id] ? "left-4 md:left-5" : "left-0.5"}`} /></div>
              </div>
              ))}
          </div>
          <div className="mt-auto border-t-2 border-slate-700 pt-4 md:pt-6">
              <span className="text-[14px] md:text-[18px] text-blue-400 uppercase tracking-widest mb-3 md:mb-4 block text-center font-black">{t[lang].distribute}</span>
              <div className="grid grid-cols-2 gap-2 md:gap-3">
                {zoneButtons.map((zone) => (
                  <div key={zone.k} onClick={() => handleToggleDist(zone.k, zone.l)} className={`p-3 md:p-5 rounded-xl md:rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${distZones[zone.k] ? `bg-blue-900/30 border-blue-500 shadow-lg` : "bg-slate-900/40 border-slate-700 hover:bg-slate-800"}`}>
                    <div className="flex flex-col gap-1 md:gap-2 text-white">{renderIcon(zone.i, 20, distZones[zone.k] ? 'text-blue-400 animate-pulse' : 'text-gray-600')}<span className="text-[12px] md:text-[16px] font-black leading-tight">{zone.l}</span></div>
                    <div className={`w-8 md:w-10 h-4 md:h-5 rounded-full relative transition-colors ${distZones[zone.k] ? "bg-blue-500" : "bg-slate-600"}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${distZones[zone.k] ? "left-5" : "left-0.5"}`} /></div>
                  </div>
                ))}
              </div>
          </div>
        </>
      )}
    </div>
  );
};

const MondayAIChat = ({ messages, inputText, setInputText, handleSendMessage, chatRef, lang, speakVoice }: { messages: ChatMessage[]; inputText: string; setInputText: Dispatch<SetStateAction<string>>; handleSendMessage: () => void; chatRef: RefObject<HTMLDivElement | null>; lang: Language; speakVoice: (text: string) => void; }) => (
  <div className="bg-slate-800/90 border-2 border-indigo-500/40 rounded-3xl p-6 md:p-8 shadow-2xl w-full flex flex-col min-h-[350px] relative overflow-hidden backdrop-blur-sm text-white shrink-0">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-8 gap-4 z-10 border-b border-slate-700/50 pb-4 md:pb-6">
      <div className="flex items-center gap-3 md:gap-4 text-white">
        <div className="bg-indigo-600 p-3 md:p-4 rounded-2xl shadow-[0_0_25px_#4f46e5] border border-indigo-400"><Bot size={32} /></div>
        <div><h2 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">Monday AI</h2><p className="text-[10px] md:text-xs text-indigo-400 font-bold uppercase tracking-[0.3em] animate-pulse mt-1">Farm Strategist Agent</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 w-full lg:w-auto">
        {[
          { label: "วิเคราะห์พืช", action: "ช่วยวิเคราะห์โรคพืชจากรูปที่ส่งให้หน่อย", icon: 'ScanSearch', color: "text-pink-400", border: "border-pink-500/40", bg: "bg-pink-500/5" },
          { label: "เช็คอายุเก็บเกี่ยว", action: "ตรวจสอบแร็คที่ใกล้เก็บเกี่ยวให้หน่อย", icon: 'Clock', color: "text-amber-400", border: "border-amber-500/40", bg: "bg-amber-500/5" },
          { label: "คำนวณปุ๋ยแม่นยำ", action: "ช่วยแนะนำสัดส่วนปุ๋ยตามค่า EC ปัจจุบันหน่อย", icon: 'Calculator', color: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-500/5" },
          { label: "ตั้งเวลาอัตโนมัติ", action: "ช่วยตั้งเวลาจัดการฟาร์มอัตโนมัติ", icon: 'Timer', color: "text-sky-400", border: "border-sky-500/40", bg: "bg-sky-500/5" }
        ].map((p, i) => (
          <button key={i} onClick={() => { setInputText(p.action); speakVoice(`กำลังเปิดฟังก์ชัน ${p.label}`); }} className={`p-3 md:p-4 rounded-xl border-2 ${p.border} ${p.bg} flex flex-col items-center justify-center gap-1.5 md:gap-2 hover:scale-105 transition-all shadow-lg text-white active:brightness-125`}>
              {renderIcon(p.icon, 20, p.color)}
              <span className="text-[9px] md:text-[10px] font-black text-center">{p.label}</span>
          </button>
        ))}
      </div>
    </div>
    <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-4 custom-scrollbar min-h-[120px]">
      {messages.map((msg) => (
        <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
          <div className={`max-w-[85%] md:max-w-[70%] p-4 md:p-5 rounded-3xl text-sm md:text-base shadow-2xl break-words whitespace-pre-wrap ${msg.sender === "user" ? "bg-indigo-600 text-white rounded-br-none border-2 border-indigo-400 font-bold" : "bg-slate-700/90 text-gray-100 rounded-bl-none border border-slate-600 backdrop-blur-xl"}`}>{msg.text}</div>
        </div>
      ))}
      <div ref={chatRef} />
    </div>
    <div className="p-2 md:p-3 bg-slate-900/90 rounded-full border-2 border-slate-700 flex gap-2 md:gap-4 items-center z-10 shadow-2xl backdrop-blur-2xl overflow-hidden">
      <button className="p-2 md:p-4 bg-slate-800 text-gray-400 rounded-full hover:text-pink-400 transition-all hover:bg-slate-700 shadow-md shrink-0"><ImageIcon size={20} /></button>
      <button className="p-2 md:p-4 bg-slate-800 text-gray-400 rounded-full hover:text-sky-400 transition-all hover:bg-slate-700 shadow-md shrink-0"><Mic size={20} /></button>
      <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === "Enter" && handleSendMessage()} placeholder={t[lang].chatPlaceholder} className="flex-1 min-w-0 bg-transparent text-white px-2 py-1 md:py-2 text-sm sm:text-base md:text-xl font-bold outline-none placeholder-slate-600" />
      <button onClick={handleSendMessage} className="p-3 md:p-5 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-all shadow-xl active:scale-90 hover:rotate-12 shrink-0"><Send size={20} /></button>
    </div>
  </div>
);

// ============================================================================
// 3. MAIN APP (State Manager)
// ============================================================================
let globalHasPlayedWelcome = false;

export default function App() {
  const climateControls: { label: string; key: keyof ClimateState; ic: string; col: string }[] = [
    { label: "แอร์ (AC)", key: "ac", ic: "Thermometer", col: "sky" },
    { label: "ดูดความชื้น", key: "dehumidifier", ic: "Droplets", col: "blue" },
    { label: "วาล์ว CO2", key: "co2", ic: "Wind", col: "teal" },
    { label: "พัดลมระบาย", key: "fan", ic: "Fan", col: "emerald" },
  ];
  const [lang, setLang] = useState<Language>("la");
  const [activeTab, setActiveTab] = useState("dashboard");

  // States
  const [espIp, setEspIp] = useState("http://10.10.0.2"); 
  const [sensorData] = useState<SensorData>({ temp: 24.5, humidity: 65, ph: 6.2, ec: 1.8, co2: 850, do: 7.8 });
  const [lights, setLights] = useState(Array(16).fill(true));
  const [pumps, setPumps] = useState<PumpState>({ a: false, b: false, acid: false, base: false, water: false, stir: false });
  const [distZones, setDistZones] = useState<DistZoneState>({ z1: false, z2: false, z3: false, z4: false, z5: false });
  const [climate, setClimate] = useState<ClimateState>({ ac: true, dehumidifier: false, co2: false, fan: false });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [editModal, setEditModal] = useState<EditModalState>({ isOpen: false, rackId: null, zone: null, plant: "", recipe: { EC: "", A: "", B: "" }, plantDate: "", target: 0, title: "" });
  const [plantCatalog, setPlantCatalog] = useState<PlantCatalogEntry[]>(() => loadInitialPlantFactoryState().plantCatalog);
  const [catalogWarning, setCatalogWarning] = useState("");

  const chatRef = useRef<HTMLDivElement | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioFileRef = useRef<string | null>(null);

  const [racksData, setRacksData] = useState<RackData[]>(() => loadInitialPlantFactoryState().racksData);
  const activePlants = deriveActivePlants(racksData, plantCatalog);

  // Handlers
  const speakVoice = useCallback((text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "th-TH";
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const sendCommandToESP = async (deviceType: string, id: string | number, state: string) => {
    if (!espIp) return;
    const commandUrl = `${espIp}/command?device=${deviceType}&id=${id}&state=${state}`;
    console.log("กำลังส่งคำสั่งไปที่: ", commandUrl);
    if (espIp.includes("10.10.0")) {
      console.log(`✅ [Sim] Sent: ${deviceType} ${id} ${state}`);
      return; 
    }
    try { await fetch(commandUrl, { mode: 'no-cors' }); } catch (e) { console.error(e); }
  };

  const handleToggleLight = (i: number) => {
    const next = !lights[i]; const newL = [...lights]; newL[i] = next; setLights(newL);
    speakVoice(`โซนแสงสว่างที่ ${i + 1} ${next ? "เปิดแล้ว" : "ปิดแล้ว"}`);
    sendCommandToESP("light", i, next ? "on" : "off");
  };

  const handleTogglePump = (k: keyof PumpState, l: string) => {
    const next = !pumps[k]; setPumps({ ...pumps, [k]: next });
    speakVoice(`${l} ${next ? "เปิดแล้ว" : "ปิดแล้ว"}`);
    sendCommandToESP("pump", k, next ? "on" : "off");
  };

  const handleToggleClimate = (k: keyof ClimateState, l: string) => {
    const next = !climate[k]; setClimate({ ...climate, [k]: next });
    speakVoice(`${l} ${next ? "เปิดแล้ว" : "ปิดแล้ว"}`);
    sendCommandToESP("climate", k, next ? "on" : "off");
  };

  const handleToggleDist = (k: keyof DistZoneState, l: string) => {
    const next = !distZones[k]; setDistZones({ ...distZones, [k]: next });
    speakVoice(`ระบบจ่ายปุ๋ย ${l} ${next ? "เปิดแล้ว" : "ปิดแล้ว"}`);
    sendCommandToESP("dist", k, next ? "on" : "off");
  };

  const updatePlantCatalogRecipe = (plantName: string, field: keyof RackRecipe, value: string) => {
    setPlantCatalog((prevCatalog) => {
      const nextCatalog = normalizePlantCatalog(
        prevCatalog.map((entry) =>
          normalizePlantName(entry.name) === normalizePlantName(plantName)
            ? {
                ...entry,
                recipe: {
                  ...entry.recipe,
                  [field]: value,
                },
              }
            : entry,
        ),
      );

      setRacksData((prevRacks) => syncRacksWithPlantCatalog(prevRacks, nextCatalog));
      return nextCatalog;
    });
  };

  const handleShelfClick = (rackId: string, shelfLevel: number, plant: string) => {
    const msg = `${t[lang].rack} ${getRackNumber(rackId)} ${t[lang].shelf} ${shelfLevel} พืชคือ ${plant}`;
    setMessages(prev => [...prev, { id: Date.now(), sender: "ai", text: msg }]);
    speakVoice(msg);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: "user", text: inputText }]);
    setInputText("");
    setTimeout(() => {
      const r = "Monday รับทราบ กำลังดำเนินการตรวจสอบให้...";
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: r }]);
      speakVoice("Monday รับทราบ กำลังดำเนินการตรวจสอบให้");
    }, 1000);
  };

  const savePlantingData = () => {
    if (!editModal.rackId) return;

    const plantName = cleanPlantName(editModal.plant);
    if (!plantName) {
      setCatalogWarning("Plant name is required.");
      return;
    }

    const currentRack = racksData.find((rack) => rack.id === editModal.rackId);
    if (!currentRack) return;

    const currentPlantKey = normalizePlantName(currentRack.plant);
    const nextPlantKey = normalizePlantName(plantName);
    const existingTargetPlant = findPlantInCatalog(plantCatalog, plantName);

    let nextCatalog = [...plantCatalog];

    if (nextPlantKey === currentPlantKey || existingTargetPlant) {
      const plantKeyToUpdate = existingTargetPlant ? normalizePlantName(existingTargetPlant.name) : currentPlantKey;

      nextCatalog = normalizePlantCatalog(
        nextCatalog.map((entry) =>
          normalizePlantName(entry.name) === plantKeyToUpdate
            ? {
                ...entry,
                name: plantName,
                icon: getPlantIcon(plantName),
                recipe: normalizeRecipe(editModal.recipe),
              }
            : entry,
        ),
      );
    } else {
      if (plantCatalog.length >= MAX_PLANT_TYPES) {
        setCatalogWarning("Plant catalog limit reached. Maximum 6 unique plant types.");
        return;
      }

      nextCatalog = normalizePlantCatalog([
        ...nextCatalog,
        {
          name: plantName,
          icon: getPlantIcon(plantName),
          recipe: normalizeRecipe(editModal.recipe),
        },
      ]);
    }

    const resolvedPlant = findPlantInCatalog(nextCatalog, plantName);
    if (!resolvedPlant) {
      setCatalogWarning("Unable to save plant settings.");
      return;
    }

    setPlantCatalog(nextCatalog);
    setRacksData((prev) =>
      syncRacksWithPlantCatalog(
        prev.map((rack) =>
          rack.id === editModal.rackId
            ? {
                ...rack,
                plant: resolvedPlant.name,
                icon: resolvedPlant.icon,
                recipe: { ...resolvedPlant.recipe },
                shelves: rack.shelves.map((shelf) =>
                  shelf.zone === editModal.zone
                    ? { ...shelf, plantDate: editModal.plantDate, target: Number(editModal.target) }
                    : shelf,
                ),
              }
            : rack,
        ),
        nextCatalog,
      ),
    );
    setCatalogWarning("");
    setEditModal((prev) => ({ ...prev, isOpen: false }));
    speakVoice("บันทึกข้อมูลเรียบร้อย");
  };

  const toggleWelcomeAudio = useCallback((file: string) => {
    if (currentAudioRef.current) currentAudioRef.current.pause();
    const audio = new Audio(file);
    currentAudioRef.current = audio; currentAudioFileRef.current = file;
    audio.play().catch(() => speakVoice("ยินดีต้อนรับสู่ เดอะ แพลนท์ แฟคทอรี่"));
  }, [speakVoice]);

  // Effects
  useEffect(() => { chatRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    window.localStorage.setItem(RACKS_STORAGE_KEY, JSON.stringify(racksData));
  }, [racksData]);
  useEffect(() => {
    window.localStorage.setItem(PLANT_CATALOG_STORAGE_KEY, JSON.stringify(plantCatalog));
  }, [plantCatalog]);
  useEffect(() => {
    const playAuto = () => {
      if (globalHasPlayedWelcome) return; globalHasPlayedWelcome = true;
      toggleWelcomeAudio('lao monday.wav');
    };
    document.addEventListener('click', playAuto, { once: true });
    return () => document.removeEventListener('click', playAuto);
  }, [toggleWelcomeAudio]);

  return (
    <div className="min-h-screen bg-[#0B1121] font-sans overflow-hidden flex flex-col relative text-slate-200 uppercase font-black">
      {/* HEADER */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 md:px-8 md:py-4 flex justify-between items-center shrink-0 z-20 shadow-2xl">
        <div className="flex items-center gap-3 md:gap-8 text-white font-bold">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-emerald-500 p-1.5 md:p-2.5 rounded-xl border border-emerald-400 shadow-[0_0_20px_#10b981] text-slate-900"><MonitorPlay className="w-5 h-5 md:w-8 md:h-8" /></div>
            <h1 className="text-sm sm:text-xl md:text-3xl font-black uppercase tracking-tighter leading-none">{t[lang].brand}</h1>
          </div>
          <div className="hidden lg:flex bg-slate-800 p-2 rounded-xl border border-slate-700 shadow-inner">
            <button onClick={() => setActiveTab("dashboard")} className={`px-5 py-2.5 rounded-lg text-lg transition-all ${activeTab === "dashboard" ? "bg-slate-700 text-white shadow-lg border border-slate-600 font-black" : "text-gray-400"}`}><Home size={18} className="inline mr-2" />{t[lang].dashboard}</button>
            <button onClick={() => setActiveTab("harvest")} className={`px-5 py-2.5 rounded-lg text-lg transition-all ${activeTab === "harvest" ? "bg-slate-700 text-emerald-400 shadow-lg border border-slate-600 font-black" : "text-gray-400"}`}><CalendarDays size={18} className="inline mr-2" />{t[lang].harvestTab}</button>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
           <div className="flex bg-slate-800 rounded-xl p-1 border border-slate-700">
             {LANG_OPTIONS.map((l) => (
               <button key={l} onClick={() => setLang(l)} className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-[8px] md:text-sm font-black transition-all ${lang === l ? "bg-emerald-600 text-white shadow-md" : "text-gray-400"}`}>{l.toUpperCase()}</button>
             ))}
           </div>
           <div className="flex flex-col gap-1">
             <button onClick={() => toggleWelcomeAudio('th monday.wav')} className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 rounded text-[7px] font-black text-white border border-indigo-400 active:scale-90">{t[lang].welcomeTH}</button>
             <button onClick={() => toggleWelcomeAudio('lao monday.wav')} className="px-2 py-0.5 bg-red-600 hover:bg-red-500 rounded text-[7px] font-black text-white border border-red-400 active:scale-90">{t[lang].welcomeLA}</button>
           </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-6 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed font-black pb-28 xl:pb-6">
        {activeTab === "dashboard" ? (
          <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar pb-10">
            <TopMetricsPanel sensorData={sensorData} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch flex-1">
              <div className="xl:col-span-2 flex flex-col gap-8">
                <RacksDisplay racksData={racksData} lights={lights} handleShelfClick={handleShelfClick} setEditModal={setEditModal} handleToggleLight={handleToggleLight} lang={lang} />
                <div className="bg-slate-800/80 border-2 border-slate-700 rounded-3xl p-6 md:p-8 shadow-2xl w-full text-white font-black uppercase shrink-0">
                   <div className="text-xl md:text-2xl flex items-center gap-3 text-teal-400 border-b border-slate-700 pb-4 mb-6"><Wind size={28}/> {t[lang].climate}</div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                     {climateControls.map((item) => (
                       <div key={item.key} onClick={() => handleToggleClimate(item.key, item.label)} className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${climate[item.key] ? `bg-${item.col}-900/30 border-${item.col}-500 shadow-lg` : "bg-slate-900/40 border-slate-700 hover:bg-slate-800"}`}>
                         <div className="flex items-center gap-3"><div className={`p-2.5 rounded-xl ${climate[item.key] ? `bg-${item.col}-500/20 text-${item.col}-400` : 'bg-slate-800 text-gray-400'}`}>{renderIcon(item.ic, 24, item.key === 'fan' && climate.fan ? 'animate-spin' : '')}</div><span className="text-xs md:text-sm">{item.label}</span></div>
                         <div className={`w-10 h-5 rounded-full relative transition-colors ${climate[item.key] ? `bg-${item.col}-500` : "bg-slate-600"}`}><div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${climate[item.key] ? "left-5" : "left-0.5"}`} /></div>
                       </div>
                     ))}
                   </div>
                </div>
                <MondayAIChat messages={messages} inputText={inputText} setInputText={setInputText} handleSendMessage={handleSendMessage} chatRef={chatRef} lang={lang} speakVoice={speakVoice} />
              </div> 
              <div className="xl:col-span-1 flex flex-col gap-6 md:gap-8 text-white font-black uppercase flex-1 h-full">
                 <LightingControl lights={lights} handleToggleLight={handleToggleLight} lang={lang} isDesktop={true} />
                 <FertigationControl activePlants={activePlants} updatePlantRecipe={updatePlantCatalogRecipe} pumps={pumps} handleTogglePump={handleTogglePump} distZones={distZones} handleToggleDist={handleToggleDist} lang={lang} isDesktop={true} />
                 <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-xl mt-4">
                    <h3 className="text-gray-400 text-xs mb-3 uppercase tracking-wider flex items-center gap-2"><Zap size={14} className="text-yellow-400"/> ESP32 IP</h3>
                    <input type="text" value={espIp} onChange={(e) => setEspIp(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 text-sm font-mono" />
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full pb-10">
             <div className="bg-slate-800/80 p-5 md:p-8 rounded-[2.5rem] border-2 border-slate-700 shadow-2xl w-full h-full flex flex-col animate-in zoom-in-95">
              <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 flex items-center gap-3 border-b border-slate-700 pb-4 text-emerald-400 tracking-tighter"><CalendarDays size={32} /> {t[lang].harvestTab}</h2>
              <div className="overflow-x-auto custom-scrollbar flex-1 rounded-2xl border border-slate-700 bg-slate-900/40 text-white font-bold">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-slate-900 text-slate-400 text-xs md:text-sm border-b border-slate-700 tracking-[0.2em]"><tr><th className="px-6 py-4 text-center font-black">#</th><th>{t[lang].rack}</th><th>{t[lang].shelf}</th><th>{t[lang].plantType}</th><th className="text-center font-black">{t[lang].plantDate}</th><th className="text-center font-black">อายุ/เป้าหมาย</th><th className="text-center font-black text-lg">วันเหลือ</th></tr></thead>
                  <tbody className="divide-y divide-slate-700/50 text-gray-200">
                    {racksData.flatMap((r) => r.shelves.map((s) => ({ ...s, rackId: r.id, plant: r.plant }))).sort((a, b) => (a.target - calculateAge(a.plantDate)) - (b.target - calculateAge(b.plantDate))).map((m, i: number) => { 
                      const age = calculateAge(m.plantDate); const rem = m.target - age; 
                      return (<tr key={i} className="hover:bg-slate-800/50 text-sm md:text-base transition-all font-bold"><td className="px-6 py-5 text-center text-slate-500 italic text-lg">{i + 1}</td><td className="px-6 py-5 font-black text-md">{t[lang].rack} {getRackNumber(m.rackId)}</td><td className="px-6 py-5 font-bold">{t[lang].shelf} {m.level}</td><td className="px-6 py-5 text-emerald-400 font-black text-md">{m.plant}</td><td className="px-6 py-5 text-center font-mono text-gray-500">{m.plantDate}</td><td className="px-6 py-5 text-center font-black text-white text-md">{age}/{m.target}</td><td className="px-6 py-5 text-center font-black text-2xl"><span className={rem <= 0 ? 'text-emerald-400 animate-pulse' : rem <= 5 ? 'text-amber-400' : 'text-blue-500'}>{rem <= 0 ? 0 : rem}</span></td></tr>); 
                    })} 
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl px-4 text-white">
          <div className="bg-slate-800 border-2 border-slate-600 rounded-[2.5rem] p-6 md:p-8 w-full max-w-md shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4"><h3 className="text-xl md:text-2xl font-black flex items-center gap-3 text-emerald-400"><CalendarDays /> {t[lang].editPlanting}</h3><button onClick={() => { setCatalogWarning(""); setEditModal({...editModal, isOpen:false}); }} className="text-gray-400 hover:text-white p-2 bg-slate-700 rounded-full transition-all hover:bg-red-500"><X size={20}/></button></div>
            <p className="text-sm md:text-lg text-gray-400 mb-6 font-bold">{editModal.title}</p>
            <div className="mb-6">
              <label className="block text-xs font-black text-gray-500 mb-2 tracking-widest">Plant Name</label>
              <input
                type="text"
                value={editModal.plant}
                onChange={(e) => { setCatalogWarning(""); setEditModal({ ...editModal, plant: e.target.value }); }}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white text-lg md:text-xl font-bold focus:border-emerald-500 outline-none"
              />
            </div>
            <div className="mb-6 grid grid-cols-3 gap-3">
              {[
                { key: "EC", label: "EC", color: "text-yellow-400" },
                { key: "A", label: "A", color: "text-emerald-400" },
                { key: "B", label: "B", color: "text-purple-400" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-black text-gray-500 mb-2 tracking-widest">{field.label}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editModal.recipe[field.key as keyof RackRecipe]}
                    onChange={(e) => {
                      setCatalogWarning("");
                      setEditModal({
                        ...editModal,
                        recipe: {
                          ...editModal.recipe,
                          [field.key]: e.target.value,
                        },
                      });
                    }}
                    className={`w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-3 py-3 text-center text-lg md:text-xl font-black focus:border-emerald-500 outline-none ${field.color}`}
                  />
                </div>
              ))}
            </div>
            {catalogWarning && <p className="mb-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm normal-case text-amber-300">{catalogWarning}</p>}
            <div className="mb-6"><label className="block text-xs font-black text-gray-500 mb-2 tracking-widest">{t[lang].plantDate}</label><input type="date" value={editModal.plantDate} onChange={(e) => setEditModal({...editModal, plantDate: e.target.value})} className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white text-lg md:text-xl font-bold focus:border-emerald-500 outline-none" /></div>
            <div className="mb-8"><label className="block text-xs font-black text-gray-500 mb-2 tracking-widest">{t[lang].targetAge}</label><input type="number" min="1" value={editModal.target} onChange={(e) => setEditModal({...editModal, target: Number(e.target.value)})} className="w-full bg-slate-900 border-2 border-slate-700 rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white text-center text-2xl md:text-3xl font-black outline-none focus:border-emerald-500" /></div>
            <div className="flex gap-4 font-black"><button onClick={() => { setCatalogWarning(""); setEditModal({...editModal, isOpen:false}); }} className="flex-1 py-4 md:py-5 rounded-2xl bg-slate-700">Cancel</button><button onClick={savePlantingData} className="flex-1 py-4 md:py-5 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-900/40">Save</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
