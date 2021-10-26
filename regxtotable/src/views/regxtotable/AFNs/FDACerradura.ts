import { random } from '../../../utils'
import { Cerradura, Operaciones } from '../types'
import FDA from './FDA.interface'
import FDAContatenacion from './FDAConcatenacion'
import FDASimple from './FDASimple'
import FDAUnion from './FDAUnion'
import Nodo from './Nodo'

class FDACerraduraKleen implements FDA {
  caracter: string
  numeroNodo: number = random(0, 1000)
  private static parentecisIzquierdo: string = '('
  private static parentecisDerecho: string = ')'
  nodoIzquierda: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: true,
    esFinal: false,
    fda: this
  })

  nodoDerecha: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: false,
    esFinal: true,
    fda: this
  })
  nodo: FDASimple | FDAContatenacion | FDAUnion | Nodo | FDACerraduraKleen

  tipo: Cerradura
  constructor (
    caracter: string,
    nodo: FDASimple | FDAContatenacion | FDAUnion,
    numeroNodo: number,
    tipo: Cerradura
  ) {
    this.nodo = nodo
    this.caracter = caracter
    this.numeroNodo = numeroNodo
    this.tipo = tipo
  }

  setNodoIzquierda () {}
  setNodoDerecha (nodoDerecha: Nodo | FDASimple) {
    this.nodoDerecha = nodoDerecha
  }

  static encontrarParentesisIzquierdo = (entrada: string[]): number => {
    console.log('encontrarParentesisIzquierdo:', { entrada })

    let indexC = -1
    entrada.find((caracter: string, index: number) => {
      if (caracter === this.parentecisIzquierdo) {
        indexC = index
        return caracter
      }
    })

    if (indexC === -1) {
      throw new Error(
        'Las clausuras requieren un parentesis de cierre ' + entrada.join()
      )
    }
    return indexC
  }
  static limpiarCerradura = (entrada: string[]): string[] => {
    entrada.pop()
    entrada.pop()
    entrada.shift()

    return entrada
  }
  static buscarCerradura = (
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
    let primerCerradura: Cerradura | null = null
    let primerIndexCerradura: number | null = null

    console.log({entrada})
    for (let index = entrada.length; index >= 0; index--) {
      const caracter = entrada[index]
      if (caracter === Cerradura.Kleen) primerCerradura = Cerradura.Kleen
      if (caracter === Cerradura.Opcional) primerCerradura = Cerradura.Opcional
      if (caracter === Cerradura.Positiva) primerCerradura = Cerradura.Positiva
      if (
        caracter === Cerradura.Kleen ||
        caracter === Cerradura.Opcional ||
        caracter === Cerradura.Positiva
      ) {
        primerIndexCerradura = index
      } else if (caracter === this.parentecisDerecho) {
        const nuevaSeccion: string[] = entrada.slice(0, index)
        const nuevaBusqueda = this.buscarCerradura(nuevaSeccion)
          index = nuevaBusqueda.index
      } else if (caracter === this.parentecisIzquierdo) {
        return {
          existe: false,
          caracter,
          index,
          tipo: Cerradura.Positiva
        }
      }
    }
    if (!primerCerradura || !primerIndexCerradura) {
      return {
        existe: false,
        caracter: '',
        index: -1,
        tipo: Cerradura.Positiva
      }
    }
    cerradura = {
      existe: true,
      caracter: primerCerradura,
      index: primerIndexCerradura,
      tipo: primerCerradura
    }
    return cerradura
  }
}

export default FDACerraduraKleen
