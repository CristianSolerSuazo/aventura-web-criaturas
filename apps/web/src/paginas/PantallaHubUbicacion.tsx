import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Map,
  Users,
  Package,
  Backpack,
  Store,
  Sparkles,
  BookOpen,
  Scroll,
  Compass,
  Coins,
  Lock,
  ArrowRight,
  ShieldCheck,
  Skull,
  LogOut,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/8bit/button";
import { Badge } from "@/components/ui/8bit/badge";
import { Skeleton } from "@/components/ui/8bit/skeleton";
import { Progress } from "@/components/ui/8bit/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/8bit/alert-dialog";
import {
  api,
  type PersonajeActivo,
  type UbicacionActual,
  type ConexionUbicacion,
  ErrorApi,
} from "@/api";
import { useAutenticacion } from "@/contextos/ContextoAutenticacion";
import {
  obtenerImagenZona,
  manejarErrorImagen,
  reproducirSonido,
  sanitizarSlugZona,
} from "@/lib/assets";
import {
  SERVICIOS_HUB,
  type ServicioHub,
  estaServicioHabilitadoEnZona,
} from "@/lib/servicios-hub";
import { cn } from "@/lib/utils";

export function PantallaHubUbicacion() {
  const navigate = useNavigate();
  const { cerrarSesion } = useAutenticacion();
  const [ubicacion, setUbicacion] = useState<UbicacionActual | null>(null);
  const [personaje, setPersonaje] = useState<PersonajeActivo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [viajando, setViajando] = useState(false);
  const [desbloqueandoId, setDesbloqueandoId] = useState<string | null>(null);

  const handleDesbloquearRuta = async (zonaId: string) => {
    if (desbloqueandoId || viajando) return;
    try {
      setDesbloqueandoId(zonaId);
      reproducirSonido("click", 0.4);
      const res = await api.verificarZona({ zonaId });
      if (res.desbloqueada) {
        reproducirSonido("confirmar", 0.6);
        toast.success(res.mensaje);
        const nuevaUbicacion = await api.obtenerUbicacionActual();
        setUbicacion(nuevaUbicacion);
      }
    } catch (error) {
      reproducirSonido("error", 0.5);
      if (error instanceof ErrorApi) {
        toast.error(error.message);
      } else {
        toast.error("No fue posible desbloquear la senda.");
      }
    } finally {
      setDesbloqueandoId(null);
    }
  };


  useEffect(() => {
    let cancelado = false;
    async function cargarDatos() {
      try {
        const [datosUbicacion, datosPersonaje] = await Promise.all([
          api.obtenerUbicacionActual(),
          api.obtenerPersonajeActivo(),
        ]);
        if (!cancelado) {
          setUbicacion(datosUbicacion);
          setPersonaje(datosPersonaje);
        }
      } catch (error) {
        if (!cancelado) {
          if (error instanceof ErrorApi && error.estado === 401) {
            toast.error("Sesión expirada o no autorizada. Ingresa nuevamente.");
            navigate("/ingreso");
          } else {
            toast.error("Error al cargar los datos del asentamiento.");
          }
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }
    cargarDatos();
    return () => {
      cancelado = true;
    };
  }, [navigate]);

  const handleViajar = async (conexion: ConexionUbicacion) => {
    if (viajando) return;
    try {
      setViajando(true);
      reproducirSonido("confirmar", 0.5);
      const respuesta = await api.viajar({ destinoId: conexion.ubicacionDestinoId });
      toast.success(respuesta.mensaje || `Has viajado hacia ${respuesta.nombre}`);
      const nuevaUbicacion = await api.obtenerUbicacionActual();
      setUbicacion(nuevaUbicacion);
    } catch (error) {
      reproducirSonido("error", 0.5);
      if (error instanceof ErrorApi) {
        if (error.codigo === "ZONA_BLOQUEADA") {
          toast.error(`Zona bloqueada: ${error.message}`);
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("No fue posible completar el viaje.");
      }
    } finally {
      setViajando(false);
    }
  };

  const handleCerrarSesion = async () => {
    reproducirSonido("click", 0.4);
    await cerrarSesion();
    toast.info("Has cerrado sesión.");
    navigate("/ingreso");
  };

  const renderIconoServicio = (icono: ServicioHub["icono"]) => {
    switch (icono) {
      case "compass":
        return <Compass className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
      case "users":
        return <Users className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
      case "package":
        return <Package className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
      case "backpack":
        return <Backpack className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
      case "store":
        return <Store className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
      case "sparkles":
        return <Sparkles className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
      case "book-open":
        return <BookOpen className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
      case "scroll":
        return <Scroll className="size-5 text-[#14d1e8] group-hover:scale-110 transition-transform" />;
    }
  };

  if (cargando) {
    return (
      <div className="space-y-6 w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-4 overflow-x-hidden animate-pulse">
        {/* Skeleton del Hero del Asentamiento con Marco 8-Bit */}
        <div className="bg-card border-4 border-black shadow-[6px_6px_0_0_#000] p-4 space-y-4">
          <Skeleton className="h-48 sm:h-64 w-full bg-[#1a2332] border-2 border-black" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Skeleton className="h-16 w-full bg-[#1a2332] border-2 border-black" />
            <Skeleton className="h-16 w-full bg-[#1a2332] border-2 border-black" />
            <Skeleton className="h-16 w-full bg-[#1a2332] border-2 border-black" />
            <Skeleton className="h-16 w-full bg-[#1a2332] border-2 border-black" />
          </div>
        </div>

        {/* Skeleton de Servicios */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Skeleton className="h-6 w-48 sm:w-64 bg-[#1a2332] border-2 border-black" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full bg-card border-2 border-black shadow-[4px_4px_0_0_#000]" />
            ))}
          </div>
        </div>

        {/* Skeleton de Rutas */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <Skeleton className="h-6 w-48 sm:w-64 bg-[#1a2332] border-2 border-black" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full bg-card border-2 border-black shadow-[4px_4px_0_0_#000]" />
            <Skeleton className="h-32 w-full bg-card border-2 border-black shadow-[4px_4px_0_0_#000]" />
          </div>
        </div>
      </div>
    );
  }

  const slugZona = ubicacion?.slug || sanitizarSlugZona(ubicacion?.nombre || ubicacion?.ubicacionId);

  return (
    <div className="space-y-6 w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 sm:py-4 overflow-x-hidden">
      {/* Hero del Asentamiento y Paisaje Retro con Marco 8-Bit */}
      <div className="relative bg-card border-4 border-black shadow-[6px_6px_0_0_#000] overflow-hidden">
        {/* Contenedor del paisaje de la zona */}
        <div className="relative w-full h-52 sm:h-64 bg-[#090d16] border-b-4 border-black overflow-hidden">
          <img
            src={obtenerImagenZona(slugZona)}
            onError={(e) => manejarErrorImagen(e, "zona")}
            alt={`Paisaje de ${ubicacion?.nombre ?? "Aethelgard"}`}
            className="w-full h-full object-cover object-center pixelated filter brightness-95 contrast-105"
          />

          {/* Degradado oscuro para integrar con el panel y maximizar contraste */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none" />

          {/* Badges superiores sobre el paisaje */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-auto z-10">
            <div>
              {ubicacion?.esSegura ? (
                <Badge
                  variant="outline"
                  font="retro"
                  className="bg-emerald-950/90 text-emerald-400 border-2 border-black shadow-[2px_2px_0_0_#000] gap-1.5 py-1 px-2.5 backdrop-blur-xs text-[8px] sm:text-[9px]"
                >
                  <ShieldCheck className="size-3.5 text-emerald-400" />
                  <span>LOCALIDAD SEGURA</span>
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  font="retro"
                  className="bg-red-950/90 text-red-400 border-2 border-black shadow-[2px_2px_0_0_#000] gap-1.5 py-1 px-2.5 backdrop-blur-xs text-[8px] sm:text-[9px]"
                >
                  <Skull className="size-3.5 text-red-400" />
                  <span>ZONA HOSTIL</span>
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              font="retro"
              disabled={viajando}
              onClick={handleCerrarSesion}
              className={cn(
                "bg-black/80 hover:bg-red-950/80 text-slate-200 hover:text-red-300 border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 text-[8px] sm:text-[9px] gap-1.5 cursor-pointer backdrop-blur-xs",
                viajando && "pointer-events-none opacity-50"
              )}
            >
              <LogOut className="size-3.5" />
              <span>SALIR</span>
            </Button>
          </div>

          {/* Nombre y descripción de la localidad */}
          <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-10">
            <div className="inline-block bg-black/60 px-2 py-0.5 border border-black/80 mb-1.5 backdrop-blur-xs">
              <span className="retro text-[8px] sm:text-[9px] text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="size-3 text-amber-400" />
                Campamento & Plaza del Gremio
              </span>
            </div>
            <h1 className="retro text-base sm:text-xl md:text-2xl text-[#14d1e8] tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-shadow-[2px_2px_0_#000] leading-tight break-words">
              {ubicacion?.nombre ?? "Villa Serena"}
            </h1>
            <p className="retro text-[8px] sm:text-[9px] text-slate-200 mt-1.5 max-w-2xl leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {ubicacion?.descripcion}
            </p>
          </div>
        </div>

        {/* Panel Superior del Explorador: Cajas Retro Táctiles (Nombre, Oro, Equipo y Almacén) */}
        <div className="p-3 sm:p-4 bg-card/95">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Nombre del Explorador */}
            <div className="p-2.5 sm:p-3 bg-muted/60 border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between hover:bg-muted/80 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="retro text-[8px] sm:text-[9px] uppercase tracking-wider">Explorador</span>
                <Compass className="size-3.5 text-[#14d1e8] shrink-0" />
              </div>
              <span
                className="retro text-[9px] sm:text-[10px] text-slate-100 font-bold leading-tight break-words"
                title={personaje?.nombre ?? "Aventurero"}
              >
                {personaje?.nombre ?? "Aventurero"}
              </span>
            </div>

            {/* Monedas de Oro con Icono Coins */}
            <div className="p-2.5 sm:p-3 bg-muted/60 border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between hover:bg-muted/80 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="retro text-[8px] sm:text-[9px] uppercase tracking-wider">Monedas</span>
                <Coins className="size-3.5 text-[#f5b724] shrink-0" />
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="retro text-[10px] sm:text-xs font-bold text-[#f5b724]">
                  {personaje?.monedas ?? 0}
                </span>
                <span className="retro text-[8px] sm:text-[9px] text-amber-200/90">oro</span>
              </div>
            </div>

            {/* Equipo Activo (X/6) con Icono Users */}
            <div className="p-2.5 sm:p-3 bg-muted/60 border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between hover:bg-muted/80 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="retro text-[8px] sm:text-[9px] uppercase tracking-wider">Equipo</span>
                <Users className="size-3.5 text-emerald-400 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="retro text-[10px] sm:text-xs font-bold text-emerald-400">
                  {personaje?.totalCriaturasEquipo ?? 0}
                </span>
                <span className="retro text-[8px] sm:text-[9px] text-slate-400">/ 6 aliados</span>
              </div>
            </div>

            {/* Almacén con Icono Package */}
            <div className="p-2.5 sm:p-3 bg-muted/60 border-2 border-black shadow-[4px_4px_0_0_#000] flex flex-col justify-between hover:bg-muted/80 transition-colors">
              <div className="flex items-center justify-between text-muted-foreground mb-1.5">
                <span className="retro text-[8px] sm:text-[9px] uppercase tracking-wider">Almacén</span>
                <Package className="size-3.5 text-cyan-400 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="retro text-[10px] sm:text-xs font-bold text-slate-200">
                  {personaje?.totalCriaturasAlmacen ?? 0}
                </span>
                <span className="retro text-[8px] sm:text-[9px] text-slate-400">criaturas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cuadrícula Interactiva de Servicios de la Localidad (8bitcn/ui) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-black border border-black flex items-center justify-center">
              <Store className="size-3.5 text-[#14d1e8]" />
            </div>
            <h2 className="retro text-xs sm:text-sm text-slate-100 tracking-wider">
              SERVICIOS DE LA LOCALIDAD
            </h2>
          </div>
          <span className="retro text-[8px] sm:text-[9px] text-slate-400 hidden sm:inline">
            Instalaciones y actividades del gremio
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {SERVICIOS_HUB.map((servicio) => {
            const disponible = estaServicioHabilitadoEnZona(servicio, ubicacion?.servicios);

            return (
              <Link
                key={servicio.id}
                to={servicio.ruta}
                onClick={() => reproducirSonido("click", 0.35)}
                className={cn(
                  "block focus:outline-hidden group",
                  viajando && "pointer-events-none opacity-50"
                )}
              >
                <div className="h-full bg-card hover:bg-[#1a2332] border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] hover:border-[#14d1e8] p-3 sm:p-4 text-left flex flex-col justify-between items-start transition-all duration-150 group-hover:scale-[1.02] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0_0_#000]">
                  <div className="w-full flex items-center justify-between mb-2.5">
                    <div className="size-9 sm:size-10 rounded-none bg-[#1a2332] group-hover:bg-black/60 border-2 border-black shadow-[2px_2px_0_0_#000] flex items-center justify-center transition-colors">
                      {renderIconoServicio(servicio.icono)}
                    </div>
                    {disponible ? (
                      <span
                        className="size-2.5 rounded-full bg-emerald-400 border border-black shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                        title="Servicio autóctono de la localidad"
                      />
                    ) : (
                      <span
                        className="size-2.5 rounded-full bg-slate-600 border border-black"
                        title="Acceso general del gremio"
                      />
                    )}
                  </div>

                  <div className="w-full text-left">
                    <span className="retro text-[9px] sm:text-[10px] font-bold text-[#14d1e8] group-hover:text-cyan-300 block leading-tight break-words mb-1.5">
                      {servicio.titulo}
                    </span>
                    <p className="retro text-[8px] sm:text-[9px] text-slate-300 sm:text-slate-400 leading-relaxed">
                      {servicio.descripcion}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Rutas y Destinos de Viaje */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          <div className="flex items-center gap-2">
            <div className="size-6 bg-black border border-black flex items-center justify-center">
              <Map className="size-3.5 text-[#14d1e8]" />
            </div>
            <h2 className="retro text-xs sm:text-sm text-slate-100 tracking-wider">
              RUTAS Y DESTINOS DE VIAJE
            </h2>
          </div>
          <span className="retro text-[8px] sm:text-[9px] text-slate-400 hidden sm:inline">
            Senderos conectados a esta posición
          </span>
        </div>

        {!ubicacion?.conexiones || ubicacion.conexiones.length === 0 ? (
          <div className="bg-card border-2 border-black shadow-[4px_4px_0_0_#000] p-6 text-center">
            <Compass className="size-8 text-slate-500 mx-auto mb-2" />
            <p className="retro text-[9px] sm:text-[10px] text-slate-300 leading-relaxed">
              No se divisan sendas transitables desde esta posición.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ubicacion.conexiones.map((conexion) => (
              <div
                key={conexion.ubicacionDestinoId}
                className="bg-card border-2 border-black shadow-[4px_4px_0_0_#000] hover:shadow-[6px_6px_0_0_#000] p-4 flex flex-col justify-between gap-3 transition-all hover:border-[#14d1e8]/80"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="retro text-[10px] sm:text-xs font-bold text-slate-100 block leading-tight break-words flex-1 min-w-0">
                      {conexion.nombre}
                    </span>

                    {conexion.estaBloqueada ? (
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge
                          variant="outline"
                          font="retro"
                          className="bg-red-950/90 text-red-400 border-2 border-black shadow-[2px_2px_0_0_#000] gap-1 text-[8px] sm:text-[9px] py-1 px-2"
                        >
                          <Lock className="size-3 text-red-400" />
                          <span>BLOQUEADA</span>
                        </Badge>
                        {conexion.cumpleRequisito && (
                          <Badge
                            variant="outline"
                            font="retro"
                            className="bg-amber-950/90 text-amber-300 border-2 border-black shadow-[2px_2px_0_0_#000] gap-1 text-[7px] sm:text-[8px] py-0.5 px-1.5"
                          >
                            <Sparkles className="size-2.5 text-amber-300" />
                            <span>LISTA PARA DESBLOQUEAR</span>
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        font="retro"
                        className="bg-emerald-950/90 text-emerald-400 border-2 border-black shadow-[2px_2px_0_0_#000] gap-1 text-[8px] sm:text-[9px] py-1 px-2 shrink-0"
                      >
                        <ArrowRight className="size-3 text-emerald-400" />
                        <span>ACCESIBLE</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] text-slate-300 retro whitespace-nowrap">
                    <Compass className="size-3.5 text-[#14d1e8] shrink-0" />
                    <span className="whitespace-nowrap">
                      Nivel sugerido: {conexion.nivelSugerido ?? "Rango libre"}
                    </span>
                  </div>

                  {conexion.estaBloqueada && (
                    <div className="border-2 border-black bg-black/50 p-2.5 space-y-1.5 mt-1">
                      <div className="flex items-center justify-between text-[8px] sm:text-[9px] retro">
                        <span className="flex items-center gap-1 text-slate-300">
                          {conexion.cumpleRequisito ? (
                            <Sparkles className="size-3 text-amber-400 shrink-0" />
                          ) : (
                            <Lock className="size-3 text-red-400 shrink-0" />
                          )}
                          <span className="font-bold">PROGRESO DE DESBLOQUEO</span>
                        </span>
                        <span className={conexion.cumpleRequisito ? "text-amber-400 font-bold" : "text-slate-300"}>
                          {conexion.progresoActual ?? 0}% / {conexion.progresoObjetivo ?? 100}%
                        </span>
                      </div>
                      <Progress
                        value={conexion.progresoActual ?? 0}
                        className="h-2 rounded-none border border-black"
                      />
                      <p className="retro text-[8px] sm:text-[9px] text-slate-300 leading-relaxed">
                        {conexion.detalleProgreso ?? conexion.requisito}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-black pt-3 mt-3">
                  {conexion.estaBloqueada ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          font="retro"
                          disabled={viajando || Boolean(desbloqueandoId)}
                          onClick={() => reproducirSonido("click", 0.3)}
                          className={cn(
                            "w-full text-[10px] text-red-400 border-2 border-black shadow-[2px_2px_0_0_#000] hover:bg-red-500/10 active:translate-y-0.5 gap-1.5 cursor-pointer",
                            viajando && "pointer-events-none opacity-50"
                          )}
                        >
                          <Lock className="size-3 text-red-400 shrink-0" />
                          <span>REQUISITO DE ACCESO</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        className="w-[calc(100vw-2rem)] sm:max-w-md !max-w-md border-4 border-black shadow-[8px_8px_0_0_#000] bg-bastion p-4 sm:p-5 overflow-hidden text-slate-100"
                      >
                        <AlertDialogHeader className="!flex !flex-col !w-full !text-left !items-stretch space-y-3">
                          <div className="w-full flex items-center gap-2 border-b-2 border-black pb-2 text-red-400">
                            <Lock className="size-4 shrink-0 text-red-400" />
                            <AlertDialogTitle className="retro text-xs sm:text-sm text-red-400 tracking-wider">
                              RUTA RESTRINGIDA
                            </AlertDialogTitle>
                          </div>

                          {/* Ficha Interior de Destino */}
                          <div className="border-2 border-black bg-black/60 p-3 space-y-1.5 shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.6)] w-full">
                            <div className="flex items-center gap-2">
                              <Lock className="size-3.5 text-red-400 shrink-0" />
                              <span className="retro text-[9px] sm:text-[10px] text-red-400 font-bold leading-tight break-words">
                                {conexion.nombre}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 retro text-[8px] sm:text-[9px] whitespace-nowrap">
                              <Compass className="size-3 text-[#14d1e8] shrink-0" />
                              <span>Nivel sugerido: {conexion.nivelSugerido ?? "Rango libre"}</span>
                            </div>
                            <div className="pt-1.5 space-y-1 border-t border-black/40">
                              <div className="flex items-center justify-between text-[8px] sm:text-[9px] retro">
                                <span className="text-slate-300">ESTADO DEL REQUISITO</span>
                                <span className={conexion.cumpleRequisito ? "text-amber-400 font-bold" : "text-slate-300"}>
                                  {conexion.progresoActual ?? 0}% / {conexion.progresoObjetivo ?? 100}%
                                </span>
                              </div>
                              <Progress
                                value={conexion.progresoActual ?? 0}
                                className="h-2 rounded-none border border-black"
                              />
                            </div>
                          </div>

                          <AlertDialogDescription className="w-full retro text-[9px] sm:text-[10px] leading-relaxed text-slate-200 text-left">
                            {conexion.detalleProgreso ?? conexion.requisito ??
                              "Esta senda requiere mayor experiencia o cumplir misiones previas con el gremio."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 w-full mt-4 !m-0 !p-0 !bg-transparent !border-0 pt-4 border-t-2 border-black/60">
                          <AlertDialogCancel
                            onClick={() => reproducirSonido("click", 0.3)}
                            className="retro !bg-[#1a2332] hover:!bg-[#232d3f] !text-slate-200 border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none text-[10px] py-2.5 px-5 cursor-pointer w-full sm:w-auto text-center"
                          >
                            CERRAR
                          </AlertDialogCancel>
                          <Button
                            onClick={() => handleDesbloquearRuta(conexion.ubicacionDestinoId)}
                            disabled={Boolean(desbloqueandoId) || viajando || conexion.cumpleRequisito === false}
                            aria-busy={desbloqueandoId === conexion.ubicacionDestinoId}
                            font="retro"
                            className={cn(
                              "text-[10px] py-2.5 px-4 font-bold border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 cursor-pointer w-full sm:w-auto gap-1.5",
                              conexion.cumpleRequisito
                                ? "bg-amber-400 hover:bg-amber-300 text-slate-950"
                                : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                            )}
                          >
                            {desbloqueandoId === conexion.ubicacionDestinoId ? (
                              <>
                                <Loader2 className="size-3.5 animate-spin" />
                                <span>VERIFICANDO...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="size-3.5" />
                                <span>DESBLOQUEAR SENDA</span>
                              </>
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          font="retro"
                          disabled={viajando}
                          aria-busy={viajando}
                          onClick={() => reproducirSonido("click", 0.3)}
                          className="w-full text-[10px] bg-[#14d1e8] hover:bg-[#14d1e8]/90 text-slate-950 font-bold border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 gap-1.5 cursor-pointer"
                        >
                          {viajando ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              <span>VIAJANDO...</span>
                            </>
                          ) : (
                            <>
                              <ArrowRight className="size-3.5" />
                              <span>VIAJAR A ESTA RUTA</span>
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent
                        className="w-[calc(100vw-2rem)] sm:max-w-md !max-w-md border-4 border-black shadow-[8px_8px_0_0_#000] bg-bastion p-4 sm:p-5 overflow-hidden text-slate-100"
                      >
                        <AlertDialogHeader className="!flex !flex-col !w-full !text-left !items-stretch space-y-3">
                          <div className="w-full flex items-center gap-2 border-b-2 border-black pb-2 text-[#14d1e8]">
                            <Compass className="size-4 text-[#14d1e8] shrink-0" />
                            <AlertDialogTitle className="retro text-xs sm:text-sm text-[#14d1e8] tracking-wider">
                              CONFIRMAR VIAJE
                            </AlertDialogTitle>
                          </div>

                          {/* Ficha Interior de Destino */}
                          <div className="border-2 border-black bg-black/60 p-3 space-y-1.5 shadow-[inset_2px_2px_0_0_rgba(0,0,0,0.6)] w-full">
                            <div className="flex items-center gap-2">
                              <Compass className="size-3.5 text-[#14d1e8] shrink-0" />
                              <span className="retro text-[9px] sm:text-[10px] text-[#14d1e8] font-bold leading-tight break-words">
                                {conexion.nombre}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 retro text-[8px] sm:text-[9px] whitespace-nowrap">
                              <ArrowRight className="size-3 text-emerald-400 shrink-0" />
                              <span>Nivel recomendado: {conexion.nivelSugerido ?? "Rango libre"}</span>
                            </div>
                          </div>

                          <AlertDialogDescription className="w-full retro text-[9px] sm:text-[10px] leading-relaxed text-slate-200 text-left">
                            ¿Deseas emprender camino hacia las tierras de este sendero? Prepárate para los peligros del viaje.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 w-full mt-4 !m-0 !p-0 !bg-transparent !border-0 pt-4 border-t-2 border-black/60">
                          <AlertDialogCancel
                            onClick={() => reproducirSonido("click", 0.3)}
                            className="retro !bg-[#1a2332] hover:!bg-[#232d3f] !text-slate-200 border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none py-2.5 px-4 text-[10px] w-full sm:w-auto shrink-0 cursor-pointer text-center"
                          >
                            PERMANECER
                          </AlertDialogCancel>
                          <AlertDialogAction
                            disabled={viajando}
                            onClick={() => handleViajar(conexion)}
                            className="retro !bg-[#14d1e8] hover:!bg-[#14d1e8]/90 !text-black font-bold border-2 border-black shadow-[2px_2px_0_0_#000] active:translate-y-0.5 active:shadow-none py-2.5 px-4 text-[10px] w-full sm:w-auto shrink-0 cursor-pointer text-center"
                          >
                            {viajando ? "VIAJANDO..." : "EMPRENDER CAMINO"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PantallaHubUbicacion;
