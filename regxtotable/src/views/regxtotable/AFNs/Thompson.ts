import { Cerradura, Operaciones } from '../types/'
import FDACerraduraKleen from './FDACerradura'
import FDAContatenacion from './FDAConcatenacion'
import FDASimple from './FDASimple'
import FDAUnion from './FDAUnion'
import Nodo from './Nodo'
/*
 Errores:
 (a|a)*|(a|b)*
*/
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
      this.fila[datos.caracter] = datos.apuntaA
    } else {
      throw new Error('No existe el caracter en el alfabeto')
    }
  }
  getFila (): {} {
    return this.fila
  }
}

class Thompson {
  private union: string = '|'
  private cerraduraKleen: string = '*'
  private epsilon: string = 'ε'
  private parentecisIzquierdo: string = '('
  private parentecisDerecho: string = ')'
  private alfabeto: string[]
  fda: FDASimple | FDAContatenacion
  fdaProcesado: string = ''
  filasTabla: FilaTabla[] = []

  nodos: number = 0
  contadorParaSaberFinales: number = 0

  constructor (datos: { entrada: string[]; alfabeto: string[] }) {
    this.alfabeto = datos.alfabeto
    this.fda = this.procesarEntrada(datos.entrada, null)
    this.generarStringFDA(this.fda)
    this.generarTablaFDA(this.fda)
  }

  agregarFilasATabla (filas: FilaTabla[]) {
    filas.forEach(fila => this.filasTabla.push(fila))
  }

  private generarStringFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    if (afnd instanceof FDAContatenacion) {
      this.generarStringFDA(afnd.nodoIzquierda)
      this.generarStringFDA(afnd.nodoDerecha)
    }
    if (afnd instanceof FDAUnion) {
      this.generarStringFDA(afnd.nodoArriba)
      this.fdaProcesado += this.union
      this.generarStringFDA(afnd.nodoAbajo)
    }
    if (afnd instanceof FDACerraduraKleen) {
      this.fdaProcesado += this.parentecisIzquierdo
      this.generarStringFDA(afnd.nodo)
      this.fdaProcesado += this.parentecisDerecho + this.cerraduraKleen
    }
    if (afnd instanceof FDASimple) {
      this.fdaProcesado += afnd.caracter
    }
  }

  generarFilasTablaFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen,
    contador: number = this.contadorParaSaberFinales
  ) {
    let letraFinal = ''
    console.log(this.contadorParaSaberFinales)
    if (this.contadorParaSaberFinales === 0) {
      letraFinal = ' Inicio '
    }

    ///GENERAR FILAS CONCATENACION
    this.contadorParaSaberFinales++

    if (afnd instanceof FDAContatenacion) {
      this.generarFilasTablaFDA(afnd.nodoIzquierda)
      this.generarFilasTablaFDA(afnd.nodoDerecha)
    }
    ///GENERAR FILAS UNION

    if (afnd instanceof FDAUnion) {
      let filaArribaDerecha: FilaTabla | null = null
      let filaAbajoDerecha: FilaTabla | null = null
      let filaArribaIzquierda: FilaTabla | null = null
      let filaAbajoIzquierda: FilaTabla | null = null

      if (afnd.nodoArriba instanceof FDAContatenacion) {
        const ultimoArribaDerecha = FDAContatenacion.traerUltimoAlaDerecha(
          afnd.nodoArriba
        )
        filaArribaDerecha = new FilaTabla(
          ultimoArribaDerecha.nodoDerecha?.numeroNodo + '',
          this.alfabeto
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        const ultimoArribaIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
          afnd.nodoArriba
        )
        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoArribaIzquierda.numeroNodo
        })
      }
      if (afnd.nodoArriba instanceof FDASimple) {
        filaArribaDerecha = new FilaTabla(
          afnd.nodoArriba.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoArriba.numeroNodo
        })
      }

      if (afnd.nodoArriba instanceof FDAUnion||afnd.nodoArriba instanceof FDACerraduraKleen) {
        filaArribaDerecha = new FilaTabla(
          afnd.nodoArriba.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )
        filaArribaDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaArribaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaArribaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoArriba.nodoIzquierda.numeroNodo
        })
      }

      if (afnd.nodoAbajo instanceof FDAContatenacion) {
        const ultimoAbajoDerecha = FDAContatenacion.traerUltimoAlaDerecha(
          afnd.nodoAbajo
        )
        filaAbajoDerecha = new FilaTabla(
          ultimoAbajoDerecha.nodoDerecha?.numeroNodo + ' ',
          this.alfabeto
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        const ultimoAbajoIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
          afnd.nodoAbajo
        )
        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
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
          afnd.nodoAbajo.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoAbajo.numeroNodo
        })
      }

      if (afnd.nodoAbajo instanceof FDAUnion||afnd.nodoAbajo instanceof FDACerraduraKleen) {
        console.log('es  union')

        filaAbajoDerecha = new FilaTabla(
          afnd.nodoAbajo.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )
        filaAbajoDerecha.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })

        filaAbajoIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaAbajoIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoAbajo.nodoIzquierda.numeroNodo
        })
      }

      if (
        filaArribaDerecha &&
        filaAbajoDerecha &&
        filaArribaIzquierda &&
        filaAbajoIzquierda
      ) {
        this.agregarFilasATabla([
          filaArribaDerecha,
          filaAbajoDerecha,
          filaArribaIzquierda,
          filaAbajoIzquierda
        ])
      } else {
        if (!filaArribaDerecha)
          throw new Error('filaArribaDerecha No está definido')
        if (!filaAbajoDerecha)
          throw new Error('filaAbajoDerecha No está definido')
        if (!filaArribaIzquierda)
          throw new Error('filaArribaIzquierda No está definido')
        if (!filaAbajoIzquierda)
          throw new Error('filaAbajoIzquierda No está definido')
      }

      this.generarFilasTablaFDA(afnd.nodoArriba)
      this.generarFilasTablaFDA(afnd.nodoAbajo)
    }
    ///GENERAR FILAS KLEEN
    if (afnd instanceof FDACerraduraKleen) {
      let filaDerecha: FilaTabla | null = null
      let filaIzquierda: FilaTabla | null = null
      let filaCentro: FilaTabla | null = null
      let filaGrande: FilaTabla | null = null

      filaGrande = new FilaTabla(
        afnd.nodoIzquierda.numeroNodo + ' ',
        this.alfabeto
      )

      if (afnd.nodoDerecha instanceof FDASimple) {
        filaGrande.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodoDerecha.numeroNodo
        })
      }

      if (afnd.nodoDerecha instanceof FDAContatenacion) {
        const ultimoIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
          afnd.nodoDerecha
        )
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
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.numeroNodo
        })

        filaDerecha = new FilaTabla(
          afnd.nodo.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )

        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
            afnd.nodoDerecha
          )
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
          afnd.nodo.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )
        filaCentro.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.numeroNodo
        })
      }

      if (afnd.nodo instanceof FDAContatenacion) {
        console.log('No debo estar aquí')
        const ultimoIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
          afnd.nodo
        )
        filaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })

        const ultimoDerecha = FDAContatenacion.traerUltimoAlaDerecha(afnd.nodo)

        filaDerecha = new FilaTabla(
          ultimoDerecha.numeroNodo + ' ',
          this.alfabeto
        )

        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
            afnd.nodoDerecha
          )
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
          ultimoDerecha.numeroNodo + ' ',
          this.alfabeto
        )
        filaCentro.setValue({
          caracter: this.epsilon,
          apuntaA: ultimoIzquierda.numeroNodo
        })
      }

      if (afnd.nodo instanceof FDAUnion) {
        filaIzquierda = new FilaTabla(
          afnd.nodoIzquierda.numeroNodo + letraFinal,
          this.alfabeto
        )
        filaIzquierda.setValue({
          caracter: this.epsilon,
          apuntaA: afnd.nodo.nodoIzquierda.numeroNodo
        })

        filaDerecha = new FilaTabla(
          afnd.nodo.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )

        if (afnd.nodoDerecha instanceof Nodo) {
          filaDerecha.setValue({
            caracter: this.epsilon,
            apuntaA: afnd.nodoDerecha.numeroNodo + ' F'
          })
        }

        if (afnd.nodoDerecha instanceof FDAContatenacion) {
          const ultimoIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
            afnd.nodoDerecha
          )
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
          afnd.nodo.nodoDerecha.numeroNodo + ' ',
          this.alfabeto
        )
        console.log({ filaCentro })
        if (afnd.nodo instanceof FDAContatenacion) {
          console.log('cambio1')
          const ultimoIzquierda = FDAContatenacion.traerUltimoAlaIzquierda(
            afnd.nodo
          )
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
      if (afnd.tipo === Cerradura.Kleen) {
        if (filaCentro && filaIzquierda && filaDerecha && filaGrande) {
          this.agregarFilasATabla([
            filaCentro,
            filaIzquierda,
            filaDerecha,
            filaGrande
          ])
        } else {
          if (!filaCentro) throw new Error('filaCentro No está definido')
          if (!filaIzquierda) throw new Error('filaIzquierda No está definido')
          if (!filaDerecha) throw new Error('filaDerecha No está definido')
          if (!filaGrande) throw new Error('filaGrande No está definido')
        }
      }
      if (afnd.tipo === Cerradura.Opcional) {
        if (filaIzquierda && filaDerecha && filaGrande) {
          this.agregarFilasATabla([filaIzquierda, filaDerecha, filaGrande])
        } else {
          if (!filaIzquierda) throw new Error('filaIzquierda No está definido')
          if (!filaDerecha) throw new Error('filaDerecha No está definido')
          if (!filaGrande) throw new Error('filaGrande No está definido')
        }
      }
      if (afnd.tipo === Cerradura.Positiva) {
        if (filaIzquierda && filaDerecha && filaCentro) {
          this.agregarFilasATabla([filaIzquierda, filaDerecha, filaCentro])
        } else {
          if (!filaIzquierda) throw new Error('filaIzquierda No está definido')
          if (!filaDerecha) throw new Error('filaDerecha No está definido')
          if (!filaCentro) throw new Error('filaCentro No está definido')
        }
      }

      this.generarFilasTablaFDA(afnd.nodo)
    }
    ///GENERAR FILAS SIMPLE

    if (afnd instanceof FDASimple) {
      //Solo son dos nodos
      const fila:FilaTabla | null= new FilaTabla(afnd.numeroNodo, this.alfabeto)

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

      this.filasTabla.push(fila)
    }
  }
  generarTablaFDA (
    afnd: FDAContatenacion | FDAUnion | FDASimple | Nodo | FDACerraduraKleen
  ) {
    this.generarFilasTablaFDA(afnd)
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
    } else if (FDACerraduraKleen.buscarCerradura(entrada).existe) {
      console.log('ES CERRADURA')
      const cerradura = FDACerraduraKleen.buscarCerradura(entrada)
      const adelanteDeCerradura = cerradura.index + 1

      mitadIzquierda = entrada.slice(0, adelanteDeCerradura)
      cerraduraLimpia = FDACerraduraKleen.limpiarCerradura([...mitadIzquierda])

      const indexParetensisIzquierdo = FDACerraduraKleen.encontrarParentesisIzquierdo(
        entrada
      )

      const cerraduraEstaAlFinal = cerradura.index === entrada.length - 1
      const cerraduraEstaAlInicio = indexParetensisIzquierdo === 0

      const soloEsCerradura = cerraduraEstaAlInicio && cerraduraEstaAlFinal

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
      if (soloEsCerradura) {
        return nuevaCerradura
      } else if (cerraduraEstaAlFinal) {
        fdaDerecho = nuevaCerradura
        mitadIzquierda = entrada.slice(0, indexParetensisIzquierdo)
        const hayUnaUnionAlFinal =
          mitadIzquierda[mitadIzquierda.length - 1] === this.union
        if (hayUnaUnionAlFinal) {
          operacion = Operaciones.Union
          mitadIzquierda.shift()
        }
        fdaIzquierdo = this.procesarEntrada(mitadIzquierda, null)
      } else {
        if (nodoDerecho) {
          fdaDerecho = nodoDerecho
        } else {
          mitadDerecha = entrada.slice(adelanteDeCerradura, finalCadena)
          console.log({mitadDerecha})
          if (mitadDerecha[0] === this.union) {
            operacion = Operaciones.Union
            mitadDerecha.shift()
          }
          fdaDerecho = this.procesarEntrada(mitadDerecha, null)
        }

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
      }
    } else if (FDAUnion.buscarUnion(entrada).existe) {
      operacion = Operaciones.Union
      const mitad: number = FDAUnion.buscarUnion(entrada).index
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
