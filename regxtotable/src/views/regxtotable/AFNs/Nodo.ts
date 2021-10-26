import { random } from "../../../utils"
import FDACerraduraKleen from "./FDACerradura"
import FDAContatenacion from "./FDAConcatenacion"
import FDASimple from "./FDASimple"
import FDAUnion from "./FDAUnion"

 class Nodo {
  esInicial: boolean
  esFinal: boolean
  caracter: string|null = null
  esDesechado: boolean
  fda: FDAContatenacion | FDASimple | FDAUnion | FDACerraduraKleen
  numeroNodo: number = random(0, 1000)
  nodoDerecha:
    | FDASimple
    | FDAContatenacion
    | FDAUnion
    | Nodo
    | FDACerraduraKleen|null = null

  constructor (datos: {
    esInicial: boolean
    esFinal: boolean
    esDesechado: boolean
    fda: FDAContatenacion | FDASimple | FDAUnion | FDACerraduraKleen
  }) {
    this.esInicial = datos.esInicial
    this.esFinal = datos.esFinal
    this.fda = datos.fda
    this.esDesechado = datos.esDesechado
  }
  setNodoDerecha (): any {}
  setNodoIzquierda (): any {}
}

export default Nodo