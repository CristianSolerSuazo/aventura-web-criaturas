import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  BESTIARIO,
  TABLAS_APARICION,
  EspecieCanonica,
  AparicionCanonica,
  calcularPresupuestoEspecie,
  calcularTasaCapturaPorPresupuesto,
} from '../src/modulos/externo/bestiario-canonico';
import { CATALOGO_ESPECIES_PROPENSO } from '../src/modulos/externo/normalizador-criaturas.util';

describe('Bestiario Canónico, Jerarquía de Atributos y Tablas de Aparición (Subfase 10j)', () => {
  const AFINIDADES_VALIDAS = new Set(['fisico', 'fuego', 'agua', 'natura', 'sombra', 'luz']);
  const TIPOS_ACCION_VALIDOS = new Set(['Ataque melé', 'Ataque a distancia', 'Estado']);

  const ZONAS_CANONICAS = ['ZON-01', 'ZON-02', 'ZON-03', 'ZON-04', 'ZON-05', 'ZON-06'];

  it('1. Carga íntegra: 30 especies soberanas con claves y 4 movimientos en slots 1..4', () => {
    assert.strictEqual(BESTIARIO.length, 30, 'El bestiario debe contener exactamente 30 especies');

    const slugs = new Set<string>();
    const idsExternos = new Set<string>();

    for (const esp of BESTIARIO) {
      assert.ok(esp.slug && esp.slug.trim().length > 0, `Slug inválido en ${esp.nombre}`);
      assert.ok(esp.idExterno && esp.idExterno.startsWith('srd-2024_'), `idExterno inválido: ${esp.idExterno}`);
      assert.ok(!slugs.has(esp.slug), `Slug duplicado detectado: ${esp.slug}`);
      assert.ok(!idsExternos.has(esp.idExterno), `idExterno duplicado detectado: ${esp.idExterno}`);
      slugs.add(esp.slug);
      idsExternos.add(esp.idExterno);

      assert.ok(esp.nombre && esp.nombre.trim().length > 0, `Nombre vacío en ${esp.slug}`);
      assert.ok(AFINIDADES_VALIDAS.has(esp.elemento), `Afinidad elemental no válida: ${esp.elemento} en ${esp.slug}`);

      // Movimientos: exactamente 4
      assert.strictEqual(
        esp.movimientos.length,
        4,
        `La especie ${esp.slug} debe poseer exactamente 4 movimientos tácticos`,
      );

      const slots = esp.movimientos.map((m) => m.slot);
      assert.deepStrictEqual(slots, [1, 2, 3, 4], `Los slots de ${esp.slug} deben ser 1, 2, 3 y 4 en orden`);

      for (const mov of esp.movimientos) {
        assert.ok(mov.nombre && mov.nombre.trim().length > 0, `Nombre de movimiento vacío en ${esp.slug}`);
        assert.ok(
          TIPOS_ACCION_VALIDOS.has(mov.tipoAccion),
          `Tipo de acción inválido: ${mov.tipoAccion} en ${mov.nombre} (${esp.slug})`,
        );
      }
    }
  });

  it('2. 5 especies por zona: 6 zonas x 5 especies = 30 apariciones sin duplicados de zona', () => {
    assert.strictEqual(
      TABLAS_APARICION.length,
      30,
      'Deben existir exactamente 30 registros en TABLAS_APARICION (5 por cada una de las 6 zonas)',
    );

    const especiesPorZona: Record<string, AparicionCanonica[]> = {};
    const especiesAsignadas = new Set<string>();

    for (const aparicion of TABLAS_APARICION) {
      assert.ok(
        ZONAS_CANONICAS.includes(aparicion.zonaId),
        `Zona desconocida en tabla de aparición: ${aparicion.zonaId}`,
      );
      if (!especiesPorZona[aparicion.zonaId]) {
        especiesPorZona[aparicion.zonaId] = [];
      }
      especiesPorZona[aparicion.zonaId].push(aparicion);

      assert.ok(
        !especiesAsignadas.has(aparicion.especieSlug),
        `La especie ${aparicion.especieSlug} está asignada a más de una zona`,
      );
      especiesAsignadas.add(aparicion.especieSlug);

      assert.ok(
        aparicion.nivelMinimo <= aparicion.nivelMaximo,
        `Rango de nivel inválido en ${aparicion.especieSlug}: ${aparicion.nivelMinimo} > ${aparicion.nivelMaximo}`,
      );
    }

    for (const zonaId of ZONAS_CANONICAS) {
      const listaZona = especiesPorZona[zonaId] || [];
      assert.strictEqual(
        listaZona.length,
        5,
        `La zona ${zonaId} debe contener exactamente 5 especies asignadas`,
      );
    }
  });

  it('3. Invariante INV-01: suma de pesos exactamente 100 por zona con plantilla [35, 35, 15, 10, 5]', () => {
    for (const zonaId of ZONAS_CANONICAS) {
      const filasZona = TABLAS_APARICION.filter((a) => a.zonaId === zonaId);
      const sumaPesos = filasZona.reduce((acc, f) => acc + f.peso, 0);
      assert.strictEqual(
        sumaPesos,
        100,
        `La suma de pesos para ${zonaId} debe ser estrictamente 100 (INV-01), obtuvo: ${sumaPesos}`,
      );

      const pesosOrdenados = filasZona.map((f) => f.peso).sort((a, b) => b - a);
      assert.deepStrictEqual(
        pesosOrdenados,
        [35, 35, 15, 10, 5],
        `La distribución de pesos en ${zonaId} debe ser [35, 35, 15, 10, 5]`,
      );
    }
  });

  it('4. Rarezas y consagración de Legendarias: behir-abismo y remorhaz-glaciar como únicas Legendarias', () => {
    const mapaEspecies = new Map<string, EspecieCanonica>(BESTIARIO.map((e) => [e.slug, e]));

    const legendarias = BESTIARIO.filter((e) => e.esLegendaria);
    assert.strictEqual(legendarias.length, 2, 'Deben existir exactamente 2 criaturas legendarias');
    const slugsLegendarias = legendarias.map((e) => e.slug).sort();
    assert.deepStrictEqual(
      slugsLegendarias,
      ['behir-abismo', 'remorhaz-glaciar'],
      'Las únicas criaturas legendarias consagradas son behir-abismo y remorhaz-glaciar',
    );

    for (const esp of legendarias) {
      assert.strictEqual(esp.esEspecial, true, `La criatura legendaria ${esp.slug} debe tener esEspecial=true`);
    }

    // Comprobar la fila de peso 5 de cada zona
    for (const zonaId of ZONAS_CANONICAS) {
      const filaPeso5 = TABLAS_APARICION.find((a) => a.zonaId === zonaId && a.peso === 5);
      assert.ok(filaPeso5, `No se encontró especie de peso 5 en ${zonaId}`);
      const especie = mapaEspecies.get(filaPeso5.especieSlug);
      assert.ok(especie, `No se encontró definición para ${filaPeso5.especieSlug}`);

      if (zonaId === 'ZON-05' || zonaId === 'ZON-06') {
        assert.strictEqual(
          especie.esLegendaria,
          true,
          `La criatura de peso 5 en ${zonaId} (${especie.slug}) debe ser Legendaria`,
        );
      } else {
        assert.strictEqual(
          especie.esEspecial,
          true,
          `La criatura de peso 5 en ${zonaId} (${especie.slug}) debe ser Especial`,
        );
        assert.strictEqual(
          especie.esLegendaria,
          false,
          `La criatura de peso 5 en ${zonaId} (${especie.slug}) no debe ser Legendaria`,
        );
      }
    }
  });

  it('5. Presupuesto por rango y límites individuales de atributos en [30, 100] (J-4)', () => {
    const mapaAparicion = new Map<string, string>(
      TABLAS_APARICION.map((a) => [a.especieSlug, a.zonaId]),
    );

    const BANDAS_NO_ESPECIAL: Record<string, [number, number]> = {
      'ZON-01': [160, 200],
      'ZON-02': [176, 220],
      'ZON-03': [196, 245],
      'ZON-04': [216, 270],
      'ZON-05': [236, 295],
      'ZON-06': [260, 325],
    };

    const BANDAS_ESPECIAL: Record<string, [number, number]> = {
      'ZON-01': [210, 210],
      'ZON-02': [230, 230],
      'ZON-03': [256, 256],
      'ZON-04': [282, 282],
    };

    for (const esp of BESTIARIO) {
      const { hpBase, ataqueBase, defensaBase, velocidadBase } = esp.statsBase;
      const stats = [hpBase, ataqueBase, defensaBase, velocidadBase];

      // J-4: cada stat en [30, 100]
      for (const s of stats) {
        assert.ok(
          s >= 30 && s <= 100,
          `Stat fuera de rango [30, 100] en ${esp.slug}: ${s}`,
        );
      }

      const presupuesto = hpBase + ataqueBase + defensaBase + velocidadBase;
      const zona = mapaAparicion.get(esp.slug)!;
      assert.ok(zona, `Zona no asignada para ${esp.slug}`);

      if (esp.slug === 'behir-abismo') {
        assert.strictEqual(presupuesto, 355, 'Behir debe tener presupuesto exacto 355');
      } else if (esp.slug === 'remorhaz-glaciar') {
        assert.strictEqual(presupuesto, 380, 'Remorhaz debe tener presupuesto exacto 380');
      } else if (esp.esEspecial) {
        const [minEsp, maxEsp] = BANDAS_ESPECIAL[zona];
        assert.ok(
          presupuesto >= minEsp && presupuesto <= maxEsp,
          `Presupuesto especial de ${esp.slug} (${presupuesto}) fuera de banda [${minEsp}, ${maxEsp}]`,
        );
      } else {
        const [minNoEsp, maxNoEsp] = BANDAS_NO_ESPECIAL[zona];
        assert.ok(
          presupuesto >= minNoEsp && presupuesto <= maxNoEsp,
          `Presupuesto común de ${esp.slug} (${presupuesto}) fuera de banda [${minNoEsp}, ${maxNoEsp}]`,
        );
      }
    }
  });

  it('6. Monotonía y Jerarquía Táctica: J-1 a J-4 y progresión de apex', () => {
    const mapaAparicion = new Map<string, string>(
      TABLAS_APARICION.map((a) => [a.especieSlug, a.zonaId]),
    );

    const calcularPresupuesto = (esp: EspecieCanonica) =>
      calcularPresupuestoEspecie(esp.statsBase);

    // Invariante J-1: Orden interno estricto por rareza en cada zona (BST(35) < BST(15) < BST(10) < BST(5))
    for (const zonaId of ZONAS_CANONICAS) {
      const aparicionesZona = TABLAS_APARICION.filter((a) => a.zonaId === zonaId);
      const bstPorPeso = new Map<number, number[]>();
      for (const ap of aparicionesZona) {
        const esp = BESTIARIO.find((e) => e.slug === ap.especieSlug)!;
        const bst = calcularPresupuesto(esp);
        const lista = bstPorPeso.get(ap.peso) ?? [];
        lista.push(bst);
        bstPorPeso.set(ap.peso, lista);
      }

      const bst35 = Math.max(...(bstPorPeso.get(35) ?? []));
      const bst15 = Math.max(...(bstPorPeso.get(15) ?? []));
      const bst10 = Math.max(...(bstPorPeso.get(10) ?? []));
      const bst5 = Math.max(...(bstPorPeso.get(5) ?? []));

      assert.ok(
        bst35 < bst15,
        `En ${zonaId}, comunes (35% BST ${bst35}) deben ser estrictamente inferiores a frecuente (15% BST ${bst15})`,
      );
      assert.ok(
        bst15 < bst10,
        `En ${zonaId}, frecuente (15% BST ${bst15}) debe ser estrictamente inferior a rara (10% BST ${bst10})`,
      );
      assert.ok(
        bst10 < bst5,
        `En ${zonaId}, rara (10% BST ${bst10}) debe ser estrictamente inferior a especial/legendaria (5% BST ${bst5})`,
      );
    }

    // Invariante J-2: Progresión monótona inter-zonal por escalafón de rareza
    const pesosVerificar = [35, 15, 10, 5];
    for (const peso of pesosVerificar) {
      const bstPorZona = ZONAS_CANONICAS.map((zonaId) => {
        const aps = TABLAS_APARICION.filter((a) => a.zonaId === zonaId && a.peso === peso);
        const bsts = aps.map((a) => {
          const esp = BESTIARIO.find((e) => e.slug === a.especieSlug)!;
          return calcularPresupuesto(esp);
        });
        return Math.max(...bsts);
      });

      for (let i = 0; i < bstPorZona.length - 1; i++) {
        assert.ok(
          bstPorZona[i] < bstPorZona[i + 1],
          `Progresión J-2 violada para peso ${peso}%: ${ZONAS_CANONICAS[i]} (${bstPorZona[i]}) no es menor que ${ZONAS_CANONICAS[i + 1]} (${bstPorZona[i + 1]})`,
        );
      }
    }

    // Presupuestos apex crecen monotónicamente a lo largo de las zonas
    const ordenApex = [
      'oso-fresno',           // Z1: 210
      'mantarraya-espectral', // Z2: 230
      'mantis-sombria',       // Z3: 256
      'golem-granito',        // Z4: 282
      'behir-abismo',         // Z5: 355
      'remorhaz-glaciar',     // Z6: 380
    ];

    const presupuestosApex = ordenApex.map((slug) => {
      const esp = BESTIARIO.find((e) => e.slug === slug)!;
      return calcularPresupuesto(esp);
    });

    for (let i = 0; i < presupuestosApex.length - 1; i++) {
      assert.ok(
        presupuestosApex[i] < presupuestosApex[i + 1],
        `Apex ${ordenApex[i]} (${presupuestosApex[i]}) debe ser menor que ${ordenApex[i + 1]} (${presupuestosApex[i + 1]})`,
      );
    }

    // Invariante J-3: Supremacía Legendaria
    const presBehir = calcularPresupuesto(BESTIARIO.find((e) => e.slug === 'behir-abismo')!);
    const presRemorhaz = calcularPresupuesto(BESTIARIO.find((e) => e.slug === 'remorhaz-glaciar')!);
    for (const esp of BESTIARIO) {
      if (esp.slug !== 'behir-abismo' && esp.slug !== 'remorhaz-glaciar') {
        const pres = calcularPresupuesto(esp);
        assert.ok(pres < presBehir, `${esp.slug} (${pres}) no debe superar o igualar a Behir (${presBehir})`);
        assert.ok(pres < presRemorhaz, `${esp.slug} (${pres}) no debe superar o igualar a Remorhaz (${presRemorhaz})`);
      }
    }

    // Invariante J-3: Propiedad de anticorrelación estricta de captura: si BST(A) > BST(B) => tasaCaptura(A) <= tasaCaptura(B)
    for (let i = 0; i < BESTIARIO.length; i++) {
      for (let j = 0; j < BESTIARIO.length; j++) {
        const bstA = calcularPresupuesto(BESTIARIO[i]);
        const bstB = calcularPresupuesto(BESTIARIO[j]);
        const tasaA = calcularTasaCapturaPorPresupuesto(bstA);
        const tasaB = calcularTasaCapturaPorPresupuesto(bstB);
        if (bstA > bstB) {
          assert.ok(
            tasaA <= tasaB,
            `Anticorrelación violada: ${BESTIARIO[i].slug} (BST ${bstA}, tasa ${tasaA}) vs ${BESTIARIO[j].slug} (BST ${bstB}, tasa ${tasaB})`,
          );
        }
      }
    }
  });

  it('7. Sets tácticos de 4 movimientos por especie con potencia balanceada', () => {
    for (const esp of BESTIARIO) {
      const [m1, m2, m3, m4] = esp.movimientos;

      // M1: Slot 1 Básico
      assert.ok(m1.poder >= 10 && m1.poder <= 22, `M1 fuera de rango en ${esp.slug}: ${m1.poder}`);

      // M2: Slot 2 Táctico
      assert.ok(m2.poder >= 11 && m2.poder <= 26, `M2 fuera de rango en ${esp.slug}: ${m2.poder}`);

      // M3: Slot 3 Cobertura
      assert.ok(m3.poder >= 10 && m3.poder <= 24, `M3 fuera de rango en ${esp.slug}: ${m3.poder}`);

      // M4: Slot 4 Furia / Técnica definitiva
      assert.ok(m4.poder >= 24 && m4.poder <= 40, `M4 fuera de rango en ${esp.slug}: ${m4.poder}`);
    }
  });

  it('8. Referencias cruzadas e integridad con snapshot local y catálogo propenso', () => {
    // Slugs de tablas de aparición existen en bestiario
    const slugsBestiario = new Set(BESTIARIO.map((e) => e.slug));
    for (const aparicion of TABLAS_APARICION) {
      assert.ok(
        slugsBestiario.has(aparicion.especieSlug),
        `Slug en tabla de aparición no existe en bestiario: ${aparicion.especieSlug}`,
      );
    }

    // CATALOGO_ESPECIES_PROPENSO contiene exactamente 30 claves
    const clavesPropensas = Object.keys(CATALOGO_ESPECIES_PROPENSO);
    assert.strictEqual(
      clavesPropensas.length,
      30,
      'CATALOGO_ESPECIES_PROPENSO debe contener exactamente 30 claves',
    );

    // Snapshot local existe y contiene las 30 claves
    const rutaSnapshot = path.resolve(__dirname, '../../../datos/open5e-srd-2024-seleccion.json');
    assert.ok(fs.existsSync(rutaSnapshot), `Snapshot no encontrado en ${rutaSnapshot}`);
    const snapshotRaw = fs.readFileSync(rutaSnapshot, 'utf-8');
    const snapshot = JSON.parse(snapshotRaw) as Array<{ key: string }>;
    const snapshotMap = new Set(snapshot.map((c) => c.key));

    for (const clave of clavesPropensas) {
      assert.ok(
        snapshotMap.has(clave),
        `La clave ${clave} de CATALOGO_ESPECIES_PROPENSO no existe en el snapshot local`,
      );
    }
  });
});
