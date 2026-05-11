// ─── Core report types matching the JSON output from nextbit_probe ───────────

export type RatingTuple = [string, string]; // ["EXCELLENT", "#00e676"]

export interface ProbeReport {
  timestamp: string;
  system: SystemInfo;
  virtualization: VirtualizationInfo;
  oem: OemInfo;
  cpu_throttle: CpuThrottleInfo;
  ram_test: RamTestInfo;
  battery: BatteryInfo;
  device_classification: DeviceClassification;
  disks: DiskInfo;
  raid_controllers: string[];
  gpu: GpuInfo;
  display: DisplayInfo;
  temperature: TemperatureInfo;
  network: NetworkInfo;
  peripherals: PeripheralsInfo;
  security: SecurityInfo;
  performance: PerformanceInfo;
  events: EventsInfo;
}

export interface SystemInfo {
  manufacturer: string;
  model: string;
  serial: string;
  bios_version: string;
  bios_date: string;
  cpu: string;
  cpu_cores: number;
  cpu_threads: number;
  cpu_mhz: number;
  ram_gb: number;
  os_name: string;
  os_build: string;
  os_arch: string;
  install_date: string;
  last_boot: string;
  cpu_arch: string;
  ethernet_adapters: number;
  hostname: string;
  os_type: string;
  os_version: string;
  python: string;
  mac_addrs: string[];
  mac_addr: string;
  machine_id: string;
  bios_age_years: number;
  bios_age_rating: RatingTuple;
}

export interface VirtualizationInfo {
  is_vm: boolean;
  hypervisor: string;
  method: string;
}

export interface OemInfo {
  oem_key: string;
  installed_last5: string;
  match: string;
}

export interface CpuThrottleInfo {
  base_mhz: number;
  stress_mhz: number;
  max_mhz: number;
  pct: number;
  rating: RatingTuple;
  warning: boolean;
}

export interface RamTestInfo {
  blocks: number;
  block_mb: number;
  errors: number;
  result: string;
  rating: RatingTuple;
  ecc: { has_ecc: boolean; details: string };
}

export interface BatteryInfo {
  present: boolean;
  percent: number;
  plugged_in: boolean;
  design_mwh: number;
  full_mwh: number;
  wear_pct: number;
  cycles: number;
  chemistry: string;
  status: string;
  rating: RatingTuple;
  desc: string;
}

export interface DeviceClassification {
  category: string;
  chassis_type: string;
  form_factor: string;
  confidence: string;
  notes: string[];
}

export interface SmartDisk {
  device: string;
  power_on_hours: number;
  wear: number;
  read_errors: number;
  reallocated: number;
}

export interface DiskMount {
  device: string;
  mountpoint: string;
  fstype: string;
  total_gb: number;
  used_gb: number;
  free_gb: number;
  used_pct: number;
}

export interface DiskInfo {
  disks: DiskMount[];
  smart: {
    power_on_hours: number;
    wear: number;
    read_errors: number;
    write_errors: string | number;
    reallocated: number;
    power_rating: RatingTuple;
    wear_rating: RatingTuple;
  };
  smart_all: SmartDisk[];
}

export interface GpuInfo {
  gpus: string[];
  gpu_name: string;
  is_dedicated: boolean;
  driver_date: string;
  vram: string;
  crashes: number;
  rating: RatingTuple;
  desc: string;
}

export interface DisplayInfo {
  manufacturer: string;
  model: string;
  connection: string;
  resolution: string;
  refresh_hz: string;
}

export interface TemperatureInfo {
  temps: Record<string, number>;
  max_temp: number;
  rating: RatingTuple;
}

export interface NetworkIface {
  interface: string;
  ip: string;
  netmask: string;
}

export interface NetworkInfo {
  wifi_name: string;
  wifi_signal: string;
  ethernet: string;
  ifaces: NetworkIface[];
  internet: boolean;
  ping_ms: number;
  mac: string;
}

export interface PeripheralsInfo {
  webcam: string;
  bluetooth: string;
  audio: string;
  keyboard: string;
  touchpad: string;
  usb_count: number;
  fan: string;
}

export interface SecurityInfo {
  activated: string;
  antivirus: string;
  firewall: string;
  tpm: string;
  secure_boot: string;
  bitlocker: string;
}

export interface TopProcess {
  name: string;
  mem_mb: number;
}

export interface PerformanceInfo {
  process_count: number;
  cpu_pct: number;
  mem_pct: number;
  startup_count: number;
  startup_rating: RatingTuple;
  top_procs: [string, number][];
  disk_read_mbs: number;
  disk_write_mbs: number;
}

export interface SystemEvent {
  msg: string;
}

export interface EventsInfo {
  count: number;
  events: SystemEvent[];
  rating: RatingTuple;
}

// ─── Computed summary used by ReportCard ─────────────────────────────────────

export interface ReportSummary {
  score: number;
  totalPossible: number;
  passedCount: number;
  failedCount: number;
  categoryScores: {
    hardware: number;
    software: number;
    security: number;
  };
  overallRating: string;
  ratingColor: string;
}

// ─── Download tile props ──────────────────────────────────────────────────────

export interface DownloadRelease {
  platform: "linux" | "windows" | "macos";
  arch?: "x86" | "x64" | "arm64" | "universal";
  version: string;
  checksum: string;
  fileSize: string;
  downloadUrl: string;
  releaseDate: string;
}

// ─── Changelog ───────────────────────────────────────────────────────────────

export interface ChangelogEntry {
  version: string;
  date: string;
  label: "latest" | "stable" | "old";
  notes: string[];
}

// ─── Contact form ─────────────────────────────────────────────────────────────

export interface FeedbackPayload {
  rating: number;
  category: string;
  name: string;
  email: string;
  message: string;
  logPaste?: string;
}

// ─── Feature card ─────────────────────────────────────────────────────────────

export interface Feature {
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}
