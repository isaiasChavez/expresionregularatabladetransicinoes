import { random } from "../../../utils"
import { Cerradura } from "../types"
import FDA from "./FDA.interface"
import FDAContatenacion from "./FDAConcatenacion"
import FDASimple from "./FDASimple"
import FDAUnion from "./FDAUnion"
import Nodo from "./Nodo"

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

  tipo:Cerradura
  constructor (
    caracter: string,
    nodo: FDASimple | FDAContatenacion | FDAUnion,
    numeroNodo: number,
    tipo:Cerradura
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
    console.log("encontrarParentesisIzquierdo:",{entrada})
    
    let indexC = -1
    entrada.find((caracter: string, index: number) => {
      if (caracter === this.parentecisIzquierdo) {
        indexC = index
        return caracter
      }
    })
    
    if (indexC === -1) {
      throw new Error('Las clausuras requieren un parentesis de cierre '+entrada.join())
    }
    return indexC
  }
  static limpiarCerradura = (entrada: string[]): string[] => {
    let seccionCerradura: string[]
    entrada.pop()
    const indexDerecho = entrada.length - 1
    const final = entrada[indexDerecho]
    const existenParentesis = final === this.parentecisDerecho
    if (existenParentesis) {
      const indexIzquierdo = FDACerraduraKleen.encontrarParentesisIzquierdo(entrada)
      seccionCerradura = entrada.slice(indexIzquierdo + 1, indexDerecho)
    } else {
      throw new Error('Las clausuras requieren parentesis')
    }
    return seccionCerradura
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
}

export default FDACerraduraKleen