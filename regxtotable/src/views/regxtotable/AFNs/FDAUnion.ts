import { random } from "../../../utils"
import FDA from "./FDA.interface"
import FDACerraduraKleen from "./FDACerradura"
import FDAContatenacion from "./FDAConcatenacion"
import FDASimple from "./FDASimple"
import Nodo from "./Nodo"

class FDAUnion implements FDA {
  caracter: string
  numeroNodo: number = random(0, 1000)
  static union:string = '|'
  //Arriba
  nodoAbajo: FDASimple | FDAContatenacion | Nodo | FDACerraduraKleen
  nodoArriba: FDASimple | FDAContatenacion | Nodo | FDACerraduraKleen
  //Abajo

  nodoDerecha: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: false,
    esFinal: true,
    fda: this
  })

  nodoIzquierda: FDASimple | Nodo = new Nodo({
    esDesechado: false,
    esInicial: true,
    esFinal: false,
    fda: this
  })

  constructor (
    caracter: string,
    nodoArriba: FDASimple | FDAContatenacion,
    nodoAbajo: FDASimple | FDAContatenacion,
    numeroNodo: number
  ) {
    this.caracter = caracter
    this.nodoArriba = nodoArriba
    this.nodoAbajo = nodoAbajo
    this.numeroNodo = numeroNodo
  }

  setNodoIzquierda () {}
  setNodoDerecha (nodoDerecha: Nodo | FDASimple) {
    this.nodoDerecha = nodoDerecha
  }

  setNodoAbajo (nodoAbajo: Nodo | FDAContatenacion | FDASimple) {
    this.nodoAbajo = nodoAbajo
  }
  setNodoArriba (nodoArriba: Nodo | FDAContatenacion | FDASimple) {
    this.nodoArriba = nodoArriba
  }
  static buscarUnion = (entrada: string[]): { existe: boolean; index: number } => {
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
}

export default FDAUnion