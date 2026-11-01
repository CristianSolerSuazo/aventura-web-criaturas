# Catálogo de Criaturas y Tablas Canónicas por Zona

Este documento especifica la planilla completa y definitiva del **Bestiario Canónico de 30 Criaturas** (5 especies por zona a lo largo de las 6 regiones de *Aethelgard: Sendas y Criaturas*), sus estadísticas normalizadas bajo soberanía interna, sus 4 movimientos tácticos por especie, y las tablas normalizadas de aparición y eventos por zona bajo el invariante **INV-01**.

---

## 1. Criterios de Selección y Soberanía Interna (Anexo A.3 y Subfase 10j)

De las criaturas del compendio `srd-2024` de Open5e, se consagraron exactamente **30 especies canónicas** distribuidas en 6 biomas regionales, cumpliendo los siguientes principios:
1. **Distribución equitativa por zona:** Cada una de las 6 zonas del mundo alberga un ecosistema cerrado de exactamente 5 especies autóctonas, sin duplicidades ni vacíos.
2. **Variedad biológica equilibrada:** Cobertura estricta de los 6 tipos biológicos del SRD 5.2: Bestia (`beast`), Monstruosidad (`monstrosity`), No-muerto (`undead`), Elemental (`elemental`), Autómata (`construct`) y Planta (`plant`).
3. **Afinidades elementales de Aethelgard:** Asignación canónica de afinidad elemental retro: Físico (`fisico`), Fuego (`fuego`), Agua (`agua`), Natura (`natura`), Sombra (`sombra`) y Luz (`luz`).
4. **Soberanía interna de atributos (Decisión D-6):** Las estadísticas base (`hpBase`, `ataqueBase`, `defensaBase`, `velocidadBase`) y el set de movimientos residen de forma inmutable y soberana en el servidor de juego (`apps/api/src/modulos/externo/bestiario-canonico.ts`). El snapshot externo de Open5e provee la semilla de lore y legitimidad SRD, pero no altera el balance competitivo.
5. **Consagración de Criaturas Legendarias:** Se eleva formalmente a `behir-abismo` (Zona 5, Presupuesto 355) y `remorhaz-glaciar` (Zona 6, Presupuesto 380) a la categoría de **Criaturas Legendarias** (`esLegendaria: true`), identificadas con la insignia `Crown` de Lucide y halo dorado retro.

---

## 2. Jerarquía de Presupuestos Tácticos (J-1 a J-4)

El presupuesto total de una criatura se define como la suma de sus 4 atributos base:
$$\text{Presupuesto} = \text{hpBase} + \text{ataqueBase} + \text{defensaBase} + \text{velocidadBase}$$
Cada atributo individual se acota estrictamente en el intervalo $[30, 100]$.

| Nivel de Jerarquía | Zona | Presupuesto Base Común | Presupuesto Especial / Apex | Especie Cúspide |
| --- | --- | --- | --- | --- |
| **J-1: Aprendiz** | ZON-01 (Praderas) | $160 - 170$ | $210$ (Especial) | `oso-fresno` (CR 0.5, BST 210) |
| **J-2: Aventurero** | ZON-02 (Marismas) | $190 - 200$ | $250$ (Especial) | `mantarraya-espectral` (CR 2, BST 250) |
| **J-3: Explorador** | ZON-03 (Ciénaga) | $215 - 225$ | $290$ (Especial) | `mantis-sombria` (CR 3, BST 290) |
| **J-4: Veterano** | ZON-04 (Ruinas) | $240 - 255$ | $330$ (Especial) | `golem-granito` (CR 5, BST 330) |
| **J-5: Maestro** | ZON-05 (Picos Helados) | $290 - 305$ | $380$ (**Legendaria**) | `behir-abismo` (CR 11, BST 380) |
| **J-6: Soberano** | ZON-06 (Volcán Fuego) | $315 - 330$ | $380$ (**Legendaria**) | `remorhaz-glaciar` (CR 11, BST 380) |

---

## 3. Planilla Definitiva del Bestiario Canónico (30 Criaturas)

| # | Zona | Nombre en español | `slug` | `keyExterna` | Tipo | Afinidad | CR | HP | ATQ | DEF | VEL | Total (BST) | Captura | Rareza |
| -: | --- | --- | --- | --- | --- | --- | -: | -: | -: | -: | -: | -: | -: | --- |
| 1 | ZON-01 | Ciervo Lunar | `ciervo-lunar` | `srd-2024_deer` | `beast` | `luz` | 0.25 | 35 | 30 | 35 | 60 | **160** | 0.70 | Común (35%) |
| 2 | ZON-01 | Víbora Rocosa | `vibora-rocosa` | `srd-2024_poisonous-snake` | `beast` | `natura` | 0.125 | 32 | 45 | 33 | 55 | **165** | 0.69 | Común (35%) |
| 3 | ZON-01 | Lobo Estepario | `lobo-estepario` | `srd-2024_wolf` | `beast` | `fisico` | 0.25 | 38 | 44 | 38 | 50 | **170** | 0.68 | Frecuente (15%) |
| 4 | ZON-01 | Halcón Ceniza | `halcon-ceniza` | `srd-2024_hawk` | `beast` | `fuego` | 0.25 | 34 | 43 | 35 | 68 | **180** | 0.65 | Raro (10%) |
| 5 | ZON-01 | Oso Fresno | `oso-fresno` | `srd-2024_black-bear` | `beast` | `fisico` | 0.5 | 58 | 54 | 52 | 46 | **210** | 0.58 | **Especial (5%)** |
| 6 | ZON-02 | Cangrejo Abismal | `cangrejo-abismal` | `srd-2024_crab` | `monstrosity` | `agua` | 0.25 | 42 | 40 | 68 | 40 | **190** | 0.63 | Común (35%) |
| 7 | ZON-02 | Anguila Penumbra | `anguila-penumbra` | `srd-2024_giant-eel` | `beast` | `sombra` | 0.5 | 45 | 50 | 45 | 60 | **200** | 0.60 | Común (35%) |
| 8 | ZON-02 | Quelonio Lacustre | `quelonio-lacustre` | `srd-2024_plesiosaurus` | `beast` | `agua` | 1 | 60 | 48 | 62 | 40 | **210** | 0.58 | Frecuente (15%) |
| 9 | ZON-02 | Tiburón Arrecife | `tiburon-arrecife` | `srd-2024_reef-shark` | `beast` | `agua` | 1 | 52 | 62 | 46 | 65 | **225** | 0.54 | Raro (10%) |
| 10 | ZON-02 | Mantarraya Espectral | `mantarraya-espectral` | `srd-2024_giant-sea-horse` | `monstrosity` | `sombra` | 2 | 65 | 60 | 55 | 70 | **250** | 0.48 | **Especial (5%)** |
| 11 | ZON-03 | Jabalí Espinoso | `jabali-espinoso` | `srd-2024_boar` | `beast` | `fisico` | 0.5 | 56 | 55 | 54 | 50 | **215** | 0.56 | Común (35%) |
| 12 | ZON-03 | Araña Gigante | `arana-gigante` | `srd-2024_giant-spider` | `beast` | `natura` | 1 | 52 | 60 | 48 | 65 | **225** | 0.54 | Común (35%) |
| 13 | ZON-03 | Basilisco | `basilisco` | `srd-2024_basilisk` | `monstrosity` | `natura` | 3 | 65 | 66 | 70 | 44 | **245** | 0.49 | Frecuente (15%) |
| 14 | ZON-03 | Treant Anciano | `treant-anciano` | `srd-2024_awakened-tree` | `plant` | `natura` | 2 | 75 | 68 | 77 | 40 | **260** | 0.45 | Raro (10%) |
| 15 | ZON-03 | Mantis Sombría | `mantis-sombria` | `srd-2024_cockatrice` | `monstrosity` | `sombra` | 3 | 66 | 78 | 66 | 80 | **290** | 0.38 | **Especial (5%)** |
| 16 | ZON-04 | Esqueleto Guerrero | `esqueleto-guerrero` | `srd-2024_skeleton` | `undead` | `sombra` | 1 | 55 | 65 | 65 | 55 | **240** | 0.50 | Común (35%) |
| 17 | ZON-04 | Gárgola | `gargola` | `srd-2024_gargoyle` | `elemental` | `fisico` | 2 | 62 | 60 | 78 | 55 | **255** | 0.46 | Común (35%) |
| 18 | ZON-04 | Espectro Ceniza | `espectro-ceniza` | `srd-2024_specter` | `undead` | `sombra` | 2 | 60 | 75 | 55 | 80 | **270** | 0.43 | Frecuente (15%) |
| 19 | ZON-04 | Escorpión Obsidiana | `escorpion-obsidiana` | `srd-2024_giant-scorpion` | `monstrosity` | `fuego` | 3 | 70 | 75 | 75 | 65 | **285** | 0.39 | Raro (10%) |
| 20 | ZON-04 | Golem Granito | `golem-granito` | `srd-2024_animated-armor` | `construct` | `fisico` | 5 | 88 | 82 | 95 | 65 | **330** | 0.28 | **Especial (5%)** |
| 21 | ZON-05 | Salamandra Magma | `salamandra-magma` | `srd-2024_fire-snake` | `elemental` | `fuego` | 4 | 70 | 76 | 72 | 72 | **290** | 0.38 | Común (35%) |
| 22 | ZON-05 | Elemental Fuego | `elemental-fuego` | `srd-2024_fire-elemental` | `elemental` | `fuego` | 5 | 74 | 82 | 68 | 81 | **305** | 0.34 | Común (35%) |
| 23 | ZON-05 | Minotauro Ceniza | `minotauro-ceniza` | `srd-2024_minotaur` | `monstrosity` | `fuego` | 3 | 82 | 80 | 76 | 82 | **320** | 0.30 | Frecuente (15%) |
| 24 | ZON-05 | Pesadilla Infernal | `pesadilla-infernal` | `srd-2024_nightmare` | `monstrosity` | `fuego` | 3 | 80 | 85 | 80 | 95 | **340** | 0.25 | Raro (10%) |
| 25 | ZON-05 | Behir del Abismo | `behir-abismo` | `srd-2024_behir` | `monstrosity` | `sombra` | 11 | 95 | 100 | 95 | 90 | **380** | 0.15 | **Legendaria (5%)** |
| 26 | ZON-06 | Horror Acorazado | `horror-acorazado` | `srd-2024_helmed-horror` | `construct` | `sombra` | 4 | 78 | 75 | 95 | 67 | **315** | 0.31 | Común (35%) |
| 27 | ZON-06 | Sombra Escarchada | `sombra-escarchada` | `srd-2024_shadow` | `undead` | `sombra` | 0.5 | 70 | 85 | 80 | 95 | **330** | 0.28 | Común (35%) |
| 28 | ZON-06 | Quimera Glacial | `quimera-glacial` | `srd-2024_chimera` | `monstrosity` | `agua` | 6 | 85 | 88 | 85 | 92 | **350** | 0.23 | Frecuente (15%) |
| 29 | ZON-06 | Mamut Lanudo | `mamut-lanudo` | `srd-2024_mammoth` | `beast` | `agua` | 6 | 98 | 94 | 92 | 86 | **370** | 0.18 | Raro (10%) |
| 30 | ZON-06 | Remorhaz del Glaciar | `remorhaz-glaciar` | `srd-2024_remorhaz` | `monstrosity` | `agua` | 11 | 95 | 100 | 95 | 90 | **380** | 0.15 | **Legendaria (5%)** |
---

## 4. Sets Tácticos de 4 Movimientos (M1..M4)

Cada especie canónica dispone de exactamente **4 movimientos ordenados por slot**:
- **Slot 1 (M1 - Básico):** Ataque elemental o físico estándar de daño constante ($12 - 16$).
- **Slot 2 (M2 - Táctico):** Ataque con efecto secundario de control, debilidad o daño moderado ($14 - 18$).
- **Slot 3 (M3 - Cobertura):** Ataque de defensa, drenaje, ventaja o potencia elevada ($16 - 22$).
- **Slot 4 (M4 - Movimiento Insignia / Furia):** Técnica definitiva de alta potencia ($24 - 36$). Bloqueada autoritativamente en servidor con código `MOVIMIENTO_BLOQUEADO` (HTTP 400) mientras la criatura posea $< 100$ de Resonancia táctica. Al alcanzar el **100% de Resonancia** (acumulada por asestar y recibir golpes), se desbloquea autoritativamente; su ejecución consume íntegramente la Resonancia reiniciando el acumulador a $0$ (implementado en **Subfase 10k**).

### 4.1 Correspondencia de Efectos del Bestiario a Estados Alterados Autoritativos

El motor autoritativo de combate (Subfase 10k) mapea los efectos de movimientos a 6 estados alterados canónicos persistidos en `detalleJson`:

| Efecto en Movimiento | Código de Estado Autoritativo | Duración | Comportamiento en Combate |
| --- | --- | :---: | --- |
| `QUEMADURA`, `IGNICION`, `QUEMADURA_GRAVE` | `QUEMADURA` | 3 turnos | DoT de Fuego: $\lfloor 0.08 \times \text{HP}_{\text{máx}} \rfloor$. No letal ($hp \ge 1$). |
| `VENENO`, `VENENO_GRAVE` | `VENENO` | 3 turnos | DoT de Natura: $\lfloor 0.06 \times \text{HP}_{\text{máx}} \rfloor$. No letal ($hp \ge 1$). |
| `ENFRIAMIENTO`, `CONGELACION` | `ESCARCHA` | 2 turnos | Reduce la velocidad efectiva a la mitad ($\lfloor \text{vel} / 2 \rfloor$). |
| `PARALISIS`, `STUN`, `ATURDIMIENTO` | `PARALISIS` | 1 turno | Pierde el turno de acción con $50\%$ de probabilidad determinista. |
| `PETRIFICACION`, `PETRIFICACION_LEVE` | `PETRIFICACION` | 1 turno | Inmoviliza totalmente a la criatura (pierde turno de acción garantizado). |
| `BASTION`, `BARRERA`, `FORTALEZA` | `BASTION` | 2 turnos | Escudo de absorción equivalente a $\lfloor 0.20 \times \text{HP}_{\text{máx}} \rfloor$. |

*Nota sobre efectos estadísticos directos (`ATQ_UP`, `DEF_DOWN`, `VEL_UP`, `CRITICO`, `DRENAJE`):* Se resuelven como modificadores inmediatos en la ronda o cálculo de daño directo.

### Desglose por Especie y Slot

| Especie (`slug`) | Slot 1 (M1 Básico) | Slot 2 (M2 Táctico) | Slot 3 (M3 Cobertura) | Slot 4 (M4 Furia - Bloqueado) |
| --- | --- | --- | --- | --- |
| `lobo-estepario` | Mordisco (Pot. 12) | Acometida Ágil (Pot. 14, `VEL_UP`) | Aullido Estepario (Pot. 10, `DEF_DOWN`) | Furia de Manada (Pot. 24, `CRITICO`) |
| `vibora-rocosa` | Picotazo (Pot. 11) | Mordedura Tóxica (Pot. 14, `VENENO`) | Constricción (Pot. 16, `PARALISIS`) | Colmillo Pétreo (Pot. 24, `VENENO_GRAVE`) |
| `ciervo-lunar` | Cornada (Pot. 11) | Pisada Luminosa (Pot. 13, `LUZ`) | Destello Lunar (Pot. 16, `CEGUERA`) | Galope Astral (Pot. 24, `PURIFICACION`) |
| `halcon-ceniza` | Picotazo Aéreo (Pot. 12) | Zarpazo Flamígero (Pot. 15, `QUEMADURA`) | Picado Veloz (Pot. 18, `VEL_UP`) | Espiral Ígnea (Pot. 26, `QUEMADURA`) |
| `oso-fresno` | Zarpazo (Pot. 14) | Dentellada Fuerte (Pot. 18, `ATQ_DOWN`) | Abrazo Aplastante (Pot. 20, `PARALISIS`) | Embestida Fresno (Pot. 28, `STUN`) |
| `cangrejo-abismal` | Pinzazo (Pot. 12) | Tenaza Quebradora (Pot. 16, `DEF_DOWN`) | Coraza Marina (Pot. 10, `BASTION`) | Marejada Abisal (Pot. 26, `DRENAJE`) |
| `anguila-penumbra` | Latigazo (Pot. 13) | Descarga Umbría (Pot. 16, `PARALISIS`) | Deslizamiento (Pot. 12, `EVASION_UP`) | Vorágine Oscura (Pot. 27, `DRENAJE`) |
| `quelonio-lacustre` | Mordisco Lacustre (Pot. 13) | Caparazón Acuático (Pot. 11, `BASTION`) | Hidroariete (Pot. 18, `EMPUJE`) | Tsunami Quelonio (Pot. 28, `DEF_UP`) |
| `tiburon-arrecife` | Dentellada Arrecife (Pot. 15) | Caza Frenética (Pot. 18, `ATQ_UP`) | Embestida Salina (Pot. 20, `HERIDA`) | Mandíbula Voraz (Pot. 30, `CRITICO`) |
| `mantarraya-espectral` | Aguijonazo (Pot. 16) | Vuelo Abisal (Pot. 19, `CONFUSION`) | Manto Espectral (Pot. 15, `INVISIBILIDAD`) | Tormenta Espectral (Pot. 32, `CONDENA`) |
| `arana-gigante` | Picadura Venenosa (Pot. 14, `VENENO`) | Disparo de Telaraña (Pot. 15, `ENREDO`) | Mordedura Parásita (Pot. 18, `DRENAJE`) | Telaraña Mortal (Pot. 28, `PARALISIS`) |
| `jabali-espinoso` | Cornada Espinosa (Pot. 14) | Carga Feroz (Pot. 17, `EMPUJE`) | Piel Espinosa (Pot. 14, `ESPINAS`) | Estampida Jabalina (Pot. 28, `CRITICO`) |
| `basilisco` | Mordedura Petrificante (Pot. 16, `PETRIFICACION_LEVE`) | Cola Látigo (Pot. 18, `DEF_DOWN`) | Mirada de Piedra (Pot. 15, `LENTITUD`) | Mirada Petrificante (Pot. 32, `PETRIFICACION`) |
| `treant-anciano` | Tajo de Rama (Pot. 15) | Arraigo Boscoso (Pot. 14, `REGENERACION`) | Embestida de Tronco (Pot. 20, `STUN`) | Furia Silvestre (Pot. 30, `BARRERA`) |
| `mantis-sombria` | Cuchillada Ágil (Pot. 17) | Golpe Quirúrgico (Pot. 20, `CRITICO`) | Manto de Sombras (Pot. 16, `EVASION_UP`) | Danza Sombría (Pot. 32, `EJECUCION`) |
| `gargola` | Garra de Granito (Pot. 16) | Picado de Piedra (Pot. 19, `DEF_DOWN`) | Postura de Estatua (Pot. 12, `FORTALEZA`) | Desprendimiento Rocoso (Pot. 30, `STUN`) |
| `esqueleto-guerrero` | Tajo de Espada (Pot. 15) | Disparo Óseo (Pot. 17, `DISTANCIA`) | Guardia Cadavérica (Pot. 13, `BLOQUEO`) | Segador de Almas (Pot. 28, `DRENAJE`) |
| `escorpion-obsidiana` | Pinza Ígnea (Pot. 17, `QUEMADURA`) | Cola de Obsidiana (Pot. 21, `VENENO`) | Coraza Candente (Pot. 15, `RETRIBUCION`) | Aguijón Apocalíptico (Pot. 34, `QUEMADURA_GRAVE`) |
| `espectro-ceniza` | Toque Gélido (Pot. 16, `ENFRIAMIENTO`) | Alarido Cenizo (Pot. 18, `TERROR`) | Paso Etéreo (Pot. 14, `DESFASADO`) | Lamento de Cenizas (Pot. 30, `CONDENA`) |
| `golem-granito` | Puñetazo de Granito (Pot. 18) | Furia de Piedra (Pot. 22, `STUN`) | Blindaje Sísmico (Pot. 16, `BASTION`) | Terremoto Arcano (Pot. 34, `SISMICO`) |
| `elemental-fuego` | Toque Flamígero (Pot. 17, `QUEMADURA`) | Llama Viva (Pot. 20, `IGNICION`) | Vórtice de Ceniza (Pot. 18, `CEGUERA`) | Piroclasma (Pot. 34, `COMBUSTION`) |
| `salamandra-magma` | Mordisco Magmático (Pot. 17) | Coletazo Candente (Pot. 19, `QUEMADURA`) | Foso Ígneo (Pot. 18, `TRAMPA_FUEGO`) | Erupción Magmática (Pot. 32, `BOMBARDEO`) |
| `pesadilla` | Casco Ardiente (Pot. 18) | Ráfaga Etérea (Pot. 21, `CONFUSION`) | Crin de Llamas (Pot. 18, `ATQ_UP`) | Salto Pesadilla (Pot. 34, `CONDENA`) |
| `quimera-tricefala` | Mordisco Dracónico (Pot. 19, `QUEMADURA`) | Cornada Caprina (Pot. 21, `EMPUJE`) | Zarpazo de León (Pot. 23, `DESGARRO`) | Aliento Tricéfalo (Pot. 36, `CALAMIDAD`) |
| `behir-abismo` | Descarga Eléctrica (Pot. 20, `PARALISIS`) | Mordedura Titánica (Pot. 24, `CRITICO`) | Constricción Relámpago (Pot. 22, `ATURDIMIENTO`) | Relámpago del Abismo (Pot. 38, `SOBRECARGA_LEGENDARIA`) |
| `yeti` | Garra Congelada (Pot. 17, `ENFRIAMIENTO`) | Bramido Polar (Pot. 20, `MIEDO`) | Muro Helado (Pot. 18, `BARRERA`) | Glaciación Brutal (Pot. 32, `CONGELACION`) |
| `lobo-invernal` | Mordisco Escarchado (Pot. 17, `ENFRIAMIENTO`) | Aliento de Escarcha (Pot. 21, `LENTITUD`) | Caza en Ventisca (Pot. 18, `VEL_UP`) | Ventisca Ártica (Pot. 34, `CONGELACION`) |
| `elemental-agua` | Golpe Torrencial (Pot. 18) | Corriente Helada (Pot. 20, `ENFRIAMIENTO`) | Manto Acuoso (Pot. 16, `REGENERACION`) | Tsunami Glaciar (Pot. 34, `MAREJADA`) |
| `tigre-dientes-sable` | Zarpazo Ártico (Pot. 18) | Colmillos Quebradores (Pot. 23, `DEF_DOWN`) | Salto Depredador (Pot. 20, `ATQ_UP`) | Desgarro Glaciar (Pot. 36, `CRITICO`) |
| `remorhaz-glaciar` | Mordedura Glacial (Pot. 22, `ENFRIAMIENTO`) | Vapor Hirviente (Pot. 26, `QUEMADURA`) | Placas Candentes (Pot. 22, `RETRIBUCION`) | Cataclismo de Magma y Escarcha (Pot. 40, `DEVASTACION_LEGENDARIA`) |

---

## 5. Tablas de Aparición por Zona (INV-01: Suma 100%)

Cada tabla asigna una probabilidad exacta y normalizada a sus 5 especies autóctonas, cumpliendo la invariante **INV-01** ($\sum \text{pesos} = 100\,\%$):
- **Especie 1 (Común 1):** $35\,\%$
- **Especie 2 (Común 2):** $35\,\%$
- **Especie 3 (Frecuente):** $15\,\%$
- **Especie 4 (Rara):** $10\,\%$
- **Especie 5 (Especial / Legendaria):** $5\,\%$

### 5.1 ZON-01: Praderas del Amanecer (Nivel 1–3)
| Especie (`slug`) | Peso relativo | Nivel mín. – máx. | Probabilidad | Tipo de encuentro |
| --- | :---: | :---: | :---: | --- |
| `lobo-estepario` | 35 | 1 – 2 | 35.0 % | Común |
| `vibora-rocosa` | 35 | 1 – 2 | 35.0 % | Común |
| `ciervo-lunar` | 15 | 1 – 3 | 15.0 % | Frecuente |
| `halcon-ceniza` | 10 | 2 – 3 | 10.0 % | Raro |
| `oso-fresno` | 5 | 2 – 3 | 5.0 % | **Especial** |
| **Total** | **100** | — | **100.0 %** | Cumple INV-01 |

### 5.2 ZON-02: Riberas del Lago Espejo (Nivel 2–4)
| Especie (`slug`) | Peso relativo | Nivel mín. – máx. | Probabilidad | Tipo de encuentro |
| --- | :---: | :---: | :---: | --- |
| `cangrejo-abismal` | 35 | 2 – 3 | 35.0 % | Común |
| `anguila-penumbra` | 35 | 2 – 3 | 35.0 % | Común |
| `quelonio-lacustre` | 15 | 2 – 4 | 15.0 % | Frecuente |
| `tiburon-arrecife` | 10 | 3 – 4 | 10.0 % | Raro |
| `mantarraya-espectral` | 5 | 3 – 4 | 5.0 % | **Especial** |
| **Total** | **100** | — | **100.0 %** | Cumple INV-01 |

### 5.3 ZON-03: Bosque Susurrante (Nivel 3–5)
| Especie (`slug`) | Peso relativo | Nivel mín. – máx. | Probabilidad | Tipo de encuentro |
| --- | :---: | :---: | :---: | --- |
| `arana-gigante` | 35 | 3 – 4 | 35.0 % | Común |
| `jabali-espinoso` | 35 | 3 – 4 | 35.0 % | Común |
| `basilisco` | 15 | 3 – 5 | 15.0 % | Frecuente |
| `treant-anciano` | 10 | 4 – 5 | 10.0 % | Raro |
| `mantis-sombria` | 5 | 4 – 5 | 5.0 % | **Especial** |
| **Total** | **100** | — | **100.0 %** | Cumple INV-01 |

### 5.4 ZON-04: Paso de los Riscos (Nivel 5–7)
| Especie (`slug`) | Peso relativo | Nivel mín. – máx. | Probabilidad | Tipo de encuentro |
| --- | :---: | :---: | :---: | --- |
| `gargola` | 35 | 5 – 6 | 35.0 % | Común |
| `esqueleto-guerrero` | 35 | 5 – 6 | 35.0 % | Común |
| `escorpion-obsidiana` | 15 | 5 – 7 | 15.0 % | Frecuente |
| `espectro-ceniza` | 10 | 6 – 7 | 10.0 % | Raro |
| `golem-granito` | 5 | 6 – 7 | 5.0 % | **Especial** |
| **Total** | **100** | — | **100.0 %** | Cumple INV-01 |

### 5.5 ZON-05: Cueva Umbría / Abismo (Nivel 7–10)
| Especie (`slug`) | Peso relativo | Nivel mín. – máx. | Probabilidad | Tipo de encuentro |
| --- | :---: | :---: | :---: | --- |
| `elemental-fuego` | 35 | 7 – 8 | 35.0 % | Común |
| `salamandra-magma` | 35 | 7 – 8 | 35.0 % | Común |
| `pesadilla` | 15 | 8 – 9 | 15.0 % | Frecuente |
| `quimera-tricefala` | 10 | 8 – 10 | 10.0 % | Raro |
| `behir-abismo` | 5 | 9 – 10 | 5.0 % | **LEGENDARIA** |
| **Total** | **100** | — | **100.0 %** | Cumple INV-01 |

### 5.6 ZON-06: Pico de la Cumbre / Glaciar (Nivel 8–12)
| Especie (`slug`) | Peso relativo | Nivel mín. – máx. | Probabilidad | Tipo de encuentro |
| --- | :---: | :---: | :---: | --- |
| `yeti` | 35 | 8 – 9 | 35.0 % | Común |
| `lobo-invernal` | 35 | 8 – 10 | 35.0 % | Común |
| `elemental-agua` | 15 | 9 – 11 | 15.0 % | Frecuente |
| `tigre-dientes-sable` | 10 | 9 – 11 | 10.0 % | Raro |
| `remorhaz-glaciar` | 5 | 10 – 12 | 5.0 % | **LEGENDARIA** |
| **Total** | **100** | — | **100.0 %** | Cumple INV-01 |

---

## 6. Tablas de Eventos de Exploración

Los eventos de exploración continúan respetando las probabilidades de la especificación (§4 y §9), satisfaciendo el invariante **INV-01**:

| Zona | Evento (`tipo`) | Peso | Probabilidad |
| --- | --- | :---: | :---: |
| **ZON-01: Praderas del Amanecer** | `ENCUENTRO` | 60 | 60.0 % |
| | `OBJETO` | 25 | 25.0 % |
| | `SIN_EVENTO` | 15 | 15.0 % |
| **ZON-02: Marismas del Ocaso** | `ENCUENTRO` | 65 | 65.0 % |
| | `OBJETO` | 20 | 20.0 % |
| | `SIN_EVENTO` | 15 | 15.0 % |
| **ZON-03: Bosque Susurrante** | `ENCUENTRO` | 65 | 65.0 % |
| | `OBJETO` | 20 | 20.0 % |
| | `SIN_EVENTO` | 15 | 15.0 % |
| **ZON-04: Paso de los Riscos** | `ENCUENTRO` | 70 | 70.0 % |
| | `OBJETO` | 20 | 20.0 % |
| | `SIN_EVENTO` | 10 | 10.0 % |
| **ZON-05: Cueva Umbría** | `ENCUENTRO` | 75 | 75.0 % |
| | `OBJETO` | 15 | 15.0 % |
| | `SIN_EVENTO` | 10 | 10.0 % |
| **ZON-06: Pico de la Cumbre** | `ENCUENTRO` | 80 | 80.0 % |
| | `OBJETO` | 15 | 15.0 % |
| | `SIN_EVENTO` | 5 | 5.0 % |
