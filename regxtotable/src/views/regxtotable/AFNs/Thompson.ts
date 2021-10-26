import { Cerradura, Operaciones } from '../types/'
import FDACerraduraKleen from './FDACerradura'
import FDAContatenacion from './FDAConcatenacion'
import FDASimple from './FDASimple'
import FDAUnion from './FDAUnion'
import Nodo from './Nodo'
export class FilaTabla {
  fila = {}
  tag: string = ``
  constructor (edo: string | number, alfabeto: string[]) {
    // @ts-ignore
    this.fila['EDO'] = edo
    alfabeto.map(caracter => {
      // @ts-ignore
      this.fila[caracter] = ''
    })
    // @ts-ignore
    this.fila[`ε`] = ''
  }
  setValue (datos: { caracter: string; apuntaA: string | number }) {
    if (this.fila.hasOwnProperty(datos.caracter)) {
      // @ts-ignore
      this.fila[datos.caracter] = datos.caracter
    } else {
      throw new Error('No existe el caracter en el alfabeto')
    }
  }
  getFila (): {} {
    return this.fila
  }
}

class Thompson {
  caracteresReservados: string[] = ['*', '?', '(', ')', '|', '+', '?']
  cerraduraPositiva: string = '+'
  cerraduraOpcional: string = '?'
  union: string = '|'
  epsilon: string = 'ε'
  cerraduraKleen: string = '*'
  parentecisIzquierdo: string = '('
  parentecisDerecho: string = ')'
  alfabeto: string[] 
  fda: FDASimple | FDAContatenacion
  fdaProcesado: string = ''
  filasTabla: FilaTabla[] = []

  nodos: number = 0

  constructor (datos:{entrada: string[],alfabeto: string[]}) {
    this.alfabeto = datos.alfabeto
    this.fda = this.procesarEntrada(datos.entrada, null)
    this.generarStringFDA(this.fda)
    this.generarTablaFDA(this.fda)
  }

  generarStringFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    if (afnd instanceof FDAContatenacion) {
      this.generarStringFDA(afnd.nodoIzquierda)
      this.generarStringFDA(afnd.nodoDerecha)
    }
    if (afnd instanceof FDAUnion) {
      this.generarStringFDA(afnd.nodoArriba)
      this.fdaProcesado += '|'
      this.generarStringFDA(afnd.nodoAbajo)
    }
    if (afnd instanceof FDACerraduraKleen) {
      this.fdaProcesado += '('
      this.generarStringFDA(afnd.nodo)
      this.fdaProcesado += ')*'
    }
    if (afnd instanceof FDASimple) {
      this.fdaProcesado += afnd.caracter
    }
  }

  traerUltimoAlaDerecha = (fda: FDAContatenacion): FDASimple | Nodo => {
    if (fda.nodoDerecha instanceof FDASimple) {
      return fda.nodoDerecha
    }
    if (fda.nodoDerecha instanceof FDAContatenacion) {
      return this.traerUltimoAlaDerecha(fda.nodoDerecha)
    }
    if (
      fda.nodoDerecha instanceof FDACerraduraKleen ||
      fda.nodoDerecha instanceof FDAUnion
    ) {
      return fda.nodoDerecha.nodoDerecha
    }
    throw new Error('No he encontrado nodo a la derecha')
  }

  traerUltimoAlaIzquierda = (fda: FDAContatenacion): FDASimple | Nodo => {
    if (fda.nodoIzquierda instanceof FDASimple) {
      return fda.nodoIzquierda
    }
    if (fda.nodoIzquierda instanceof FDAContatenacion) {
      return this.traerUltimoAlaIzquierda(fda.nodoIzquierda)
    }
    if (
      fda.nodoIzquierda instanceof FDACerraduraKleen ||
      fda.nodoIzquierda instanceof FDAUnion
    ) {
      //A la izquierda del concatendado y a la izquierda de ese mismo
      return fda.nodoIzquierda.nodoIzquierda
    }
    throw new Error('No he encontrado nodo a la izquierda')
  }

  generarFilasTablaFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    ///GENERAR FILAS CONCATENACION
    if (afnd instanceof FDAContatenacion) {
      this.generarFilasTablaFDA(afnd.nodoIzquierda)
      this.generarFilasTablaFDA(afnd.nodoDerecha)
    }
    ///GENERAR FILAS UNION

    if (afnd instanceof FDAUnion) {
      let filaArribaDerecha: FilaTabla
      let filaAbajoDerecha: FilaTabla
      let filaArribaIzquierda: FilaTabla
      let filaAbajoIzquierda: FilaTabla

      if (afnd.nodoArriba instanceof FDAContatenacion) {
        const ultimoArribaDerecha = this.traerUltimoAlaDerecha(afnd.nodoArriba)
        filaArribaDerecha = new FilaTabla(
          ultimoArribaDerecha.nodoDerecha?.numeroNodo + ' IN',
          this.alfabeto
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        const ultimoArribaIzquierda = this.traerUltimoAlaIzquierda(
          afnd.nodoArriba
        )
        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' IN',
          this.alfabeto
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoArribaIzquierda.numeroNodo
        })
      }
      if (afnd.nodoArriba instanceof FDASimple) {
        filaArribaDerecha = new FilaTabla(
          afnd.nodoArriba.nodoDerecha.numeroNodo + ' IN',
          this.alfabeto
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' IN',
          this.alfabeto
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoArriba.numeroNodo
        })
      }

      if (afnd.nodoArriba instanceof FDAUnion) {
        filaArribaDerecha = new FilaTabla(
          afnd.nodoArriba.nodoDerecha.numeroNodo + ' IN',
          this.alfabeto
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' IN',
          this.alfabeto
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoArriba.nodoIzquierda.numeroNodo
        })
      }

      if (afnd.nodoAbajo instanceof FDAContatenacion) {
        const ultimoAbajoDerecha = this.traerUltimoAlaDerecha(afnd.nodoAbajo)
        filaAbajoDerecha = new FilaTabla(
          ultimoAbajoDerecha.nodoDerecha?.numeroNodo + ' CON',
          this.alfabeto
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        const ultimoAbajoIzquierda = this.traerUltimoAlaIzquierda(
          afnd.nodoAbajo
        )
        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' CON',
          this.alfabeto
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoAbajoIzquierda.numeroNodo
        })
      }
      if (afnd.nodoAbajo instanceof FDASimple) {
        console.log('es simple')
        filaAbajoDerecha = new FilaTabla(
          afnd.nodoAbajo.nodoDerecha.numeroNodo + ' SIMPLE',
          this.alfabeto
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' SIMPLE',
          this.alfabeto
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoAbajo.numeroNodo
        })
      }

      if (afnd.nodoAbajo instanceof FDAUnion) {
        console.log('es  UNION')

        filaAbajoDerecha = new FilaTabla(
          afnd.nodoAbajo.nodoDerecha.numeroNodo + ' UNION',
          this.alfabeto
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' UNION',
          this.alfabeto
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoAbajo.nodoIzquierda.numeroNodo
        })
      }
      // @ts-ignore
      this.filasTabla.push(filaArribaDerecha)
      // @ts-ignore
      this.filasTabla.push(filaAbajoDerecha)
      // @ts-ignore
      this.filasTabla.push(filaArribaIzquierda)
      // @ts-ignore
      this.filasTabla.push(filaAbajoIzquierda)

      this.generarFilasTablaFDA(afnd.nodoArriba)
      this.generarFilasTablaFDA(afnd.nodoAbajo)
    }
    ///GENERAR FILAS KLEEN
    if (afnd instanceof FDACerraduraKleen) {
      let filaDerecha: FilaTabla
      let filaIzquierda: FilaTabla
      let filaCentro: FilaTabla
      let filaGrande: FilaTabla

      filaGrande = new FilaTabla(
        afnd.nodoIzquierda.numeroNodo + ' KLENN 1',
        this.alfabeto
      )

      if (afnd.nodoDerecha instanceof FDASimple) {
        filaGrande.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
      }

      if (afnd.nodoDerecha instanceof FDAContatenacion) {
        const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
        filaGrande.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })
      }
      if (
        afnd.nodoDerecha instanceof FDAUnion ||
        afnd.nodoDerecha instanceof FDACerraduraKleen
      ) {
        filaGrande.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
        })
      }

      if (afnd.nodo instanceof FDASimple) {
        console.log('No debo estar aquí')
        filaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' KLENN 2',
          this.alfabeto
        )
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.numeroNodo
        })

        filaDerecha = new FilaTabla(
          afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 3',
          this.alfabeto
        )

        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodoDerecha instanceof FDAUnion ||
          afnd.nodoDerecha instanceof FDACerraduraKleen
        ) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo.nodoDerecha instanceof FDASimple) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.numeroNodo
          })
        }

        filaCentro = new FilaTabla(
          afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 4',
          this.alfabeto
        )
        filaCentro.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.numeroNodo
        })
      }

      if (afnd.nodo instanceof FDAContatenacion) {
        console.log('No debo estar aquí')
        const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodo)
        filaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' KLENN 5',
          this.alfabeto
        )
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })

        const ultimoDerecha = this.traerUltimoAlaDerecha(afnd.nodo)

        filaDerecha = new FilaTabla(
          ultimoDerecha.numeroNodo + ' KLENN 6',
          this.alfabeto
        )

        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodoDerecha instanceof FDAUnion ||
          afnd.nodoDerecha instanceof FDACerraduraKleen
        ) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo.nodoDerecha instanceof FDASimple) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.numeroNodo
          })
        }

        filaCentro = new FilaTabla(
          ultimoDerecha.numeroNodo + ' KLENN 7',
          this.alfabeto
        )
        filaCentro.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })
      }

      if (afnd.nodo instanceof FDAUnion) {
        filaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + ' KLENN 8',
          this.alfabeto
        )
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.nodoIzquierda.numeroNodo
        })

        filaDerecha = new FilaTabla(
          afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 9',
          this.alfabeto
        )

        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodoDerecha)
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (
          afnd.nodoDerecha instanceof FDAUnion ||
          afnd.nodoDerecha instanceof FDACerraduraKleen
        ) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo.nodoDerecha instanceof FDASimple) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.numeroNodo
          })
        }

        filaCentro = new FilaTabla(
          afnd.nodo.nodoDerecha.numeroNodo + ' KLENN 10',
          this.alfabeto
        )
        console.log({ filaCentro })
        if (afnd.nodo instanceof FDAContatenacion) {
          console.log('cambio1')
          const ultimoIzquierda = this.traerUltimoAlaIzquierda(afnd.nodo)
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: ultimoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo instanceof FDAUnion) {
          console.log('cambio2')
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodo.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo instanceof FDACerraduraKleen) {
          console.log('cambio3')
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodo.nodoIzquierda.numeroNodo
          })
        }
        if (afnd.nodo instanceof FDASimple) {
          console.log('cambio4')
          filaCentro.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodo.numeroNodo
          })
        }
      }
      //

      if (afnd.tipo === Cerradura.Kleen) {
        // @ts-ignore
        this.filasTabla.push(filaCentro)
        // @ts-ignore
        this.filasTabla.push(filaIzquierda)
        // @ts-ignore
        this.filasTabla.push(filaDerecha)
        // @ts-ignore
        this.filasTabla.push(filaGrande)
      }
      if (afnd.tipo === Cerradura.Opcional) {
        // @ts-ignore
        this.filasTabla.push(filaIzquierda)
        // @ts-ignore
        this.filasTabla.push(filaDerecha)
        // @ts-ignore
        this.filasTabla.push(filaGrande)
      }
      if (afnd.tipo === Cerradura.Positiva) {
        // @ts-ignore
        this.filasTabla.push(filaIzquierda)
        // @ts-ignore
        this.filasTabla.push(filaDerecha)
        // @ts-ignore
        this.filasTabla.push(filaCentro)
      }

      this.generarFilasTablaFDA(afnd.nodo)
    }
    ///GENERAR FILAS SIMPLE

    if (afnd instanceof FDASimple) {
      //Solo son dos nodos
      const fila = new FilaTabla(afnd.numeroNodo, this.alfabeto)

      if (afnd.nodoDerecha instanceof FDAContatenacion) {
        fila.setValue({
          caracter: afnd.caracter,
          apuntaA: afnd.nodoDerecha.nodoIzquierda.numeroNodo
        })
      } else {
        fila.setValue({
          caracter: afnd.caracter,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
      }

      // @ts-ignore
      this.filasTabla.push(fila)
    }
  }
  generarTablaFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    this.generarFilasTablaFDA(afnd)
  }

 

  encontrarParentesisIzquierdo = (entrada: string[]): number => {
    let indexC = -1
    entrada.find((caracter: string, index: number) => {
      if (caracter === this.parentecisIzquierdo) {
        indexC = index
        return caracter
      }
    })
    if (indexC === -1) {
      throw new Error('Las clausuras requieren un parentesis de cierre')
    }
    return indexC
  }

  buscarCerradura = (
    entrada: string[]
  ): { existe: boolean; caracter: string; index: number; tipo: Cerradura } => {
    let cerradura: {
      existe: boolean
      caracter: string
      index: number
      tipo: Cerradura
    } = {
      existe: false,
      index: -1,
      caracter: '',
      tipo: Cerradura.Kleen
    }
    entrada.find((caracter: string, index: number) => {
      if (caracter === Cerradura.Kleen) {
        cerradura = {
          existe: true,
          caracter,
          index,
          tipo: Cerradura.Kleen
        }
        return caracter
      }
      if (caracter === Cerradura.Opcional) {
        cerradura = {
          existe: true,
          caracter,
          index,
          tipo: Cerradura.Opcional
        }
        return caracter
      }
      if (caracter === Cerradura.Positiva) {
        cerradura = {
          existe: true,
          caracter,
          index,
          tipo: Cerradura.Positiva
        }
        return caracter
      }
    })
    return cerradura
  }
  buscarUnion = (entrada: string[]): { existe: boolean; index: number } => {
    let union: {
      existe: boolean
      index: number
    } = {
      existe: false,
      index: -1
    }
    entrada.find((caracter: string, index: number) => {
      if (caracter === this.union) {
        union = {
          existe: true,
          index
        }
        return caracter
      }
    })
    return union
  }
  limpiarCerradura = (entrada: string[]): string[] => {
    let seccionCerradura: string[]
    entrada.pop()
    const indexDerecho = entrada.length - 1
    const final = entrada[indexDerecho]
    const existenParentesis = final === this.parentecisDerecho
    if (existenParentesis) {
      const indexIzquierdo = this.encontrarParentesisIzquierdo(entrada)
      seccionCerradura = entrada.slice(indexIzquierdo + 1, indexDerecho)
    } else {
      throw new Error('Las clausuras requieren parentesis')
    }
    return seccionCerradura
  }
  procesarEntrada = (
    entrada: string[],
    nodoDerecho:
      | FDACerraduraKleen
      | FDASimple
      | FDAContatenacion
      | FDAUnion
      | null,
    numeroNodo: number = ++this.nodos
  ): FDASimple | FDAContatenacion | FDAUnion => {
    /*     const nodoIzquierdo:FDA
    const nodoDerecho:FDA */
    let operacion: Operaciones = Operaciones.Contatenacion
    let mitadIzquierda: string[]
    let mitadDerecha: string[]
    let fdaIzquierdo: FDASimple | FDAContatenacion
    let fdaDerecho: FDASimple | FDAContatenacion
    let nuevoFDA: FDASimple | FDAContatenacion | null = null
    const finalCadena = entrada.length
    let cerraduraLimpia: string[]

    if (entrada.length === 1) {
      return new FDASimple(entrada[0], numeroNodo)
    } else if (this.buscarCerradura(entrada).existe) {
      console.log('ES CERRADURA')

      const cerradura = this.buscarCerradura(entrada)
      const adelanteDeCerradura = cerradura.index + 1
      mitadIzquierda = entrada.slice(0, adelanteDeCerradura)

      cerraduraLimpia = this.limpiarCerradura([...mitadIzquierda])

      const indexParetensisIzquierdo = this.encontrarParentesisIzquierdo(
        entrada
      )

      if (!nodoDerecho) {
        mitadDerecha = entrada.slice(adelanteDeCerradura, finalCadena)

        if (mitadDerecha[0] === this.union) {
          operacion = Operaciones.Union
          mitadDerecha.shift()
        }

        fdaDerecho = this.procesarEntrada(mitadDerecha, null)
      } else {
        fdaDerecho = nodoDerecho
      }

      const cerraduraProcesada:
        | FDAContatenacion
        | FDASimple
        | FDAUnion = this.procesarEntrada(cerraduraLimpia, null)

      const nuevaCerradura: FDACerraduraKleen = new FDACerraduraKleen(
        `(${cerraduraProcesada.caracter})*`,
        cerraduraProcesada,
        numeroNodo,
        cerradura.tipo
      )
      const cerraduraEstaAlInicio = indexParetensisIzquierdo === 0
      if (!cerraduraEstaAlInicio) {
        const mitadMitadIzquierdaConCerradura = entrada.slice(
          0,
          indexParetensisIzquierdo
        )
        fdaIzquierdo = this.procesarEntrada(
          mitadMitadIzquierdaConCerradura,
          nuevaCerradura
        )
      } else {
        fdaIzquierdo = nuevaCerradura
      }
    } else if (this.buscarUnion(entrada).existe) {
      operacion = Operaciones.Union
      const mitad: number = this.buscarUnion(entrada).index
      mitadIzquierda = entrada.slice(0, mitad)
      fdaIzquierdo = this.procesarEntrada(mitadIzquierda, null)

      if (!nodoDerecho) {
        const adelanteDelCaracter = mitad + 1
        mitadDerecha = entrada.slice(adelanteDelCaracter, finalCadena)
        fdaDerecho = this.procesarEntrada(mitadDerecha, null)
      } else {
        fdaDerecho = nodoDerecho
      }
    } else {
      // @ts-ignore
      mitadIzquierda = [entrada.shift()]
      mitadDerecha = entrada

      fdaIzquierdo = this.procesarEntrada(mitadIzquierda, null)
      if (!nodoDerecho) {
        fdaDerecho = this.procesarEntrada(mitadDerecha, null)
      } else {
        fdaDerecho = this.procesarEntrada(mitadDerecha, nodoDerecho)
      }
    }

    switch (operacion) {
      case Operaciones.Contatenacion:
        nuevoFDA = new FDAContatenacion(
          `${fdaIzquierdo.caracter}  ${fdaDerecho.caracter}`,
          fdaIzquierdo,
          fdaDerecho,
          numeroNodo
        )
        break
      case Operaciones.Union:
        nuevoFDA = new FDAUnion(
          `${fdaIzquierdo.caracter} | ${fdaDerecho.caracter}`,
          fdaIzquierdo,
          fdaDerecho,
          numeroNodo
        )
        break

      default:
        break
    }
    if (!nuevoFDA) {
      throw new Error('No se ha podido crear el FDA')
    }
    return nuevoFDA
  }
}

export default Thompson
