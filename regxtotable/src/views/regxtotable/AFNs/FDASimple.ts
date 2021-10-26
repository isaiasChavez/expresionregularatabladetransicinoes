import { random } from "../../../utils"
import FDA from "./FDA.interface"
import FDACerraduraKleen from "./FDACerradura"
import FDAContatenacion from "./FDAConcatenacion"
import Nodo from "./Nodo"

class FDASimple implements FDA {
  caracter: string
  numeroNodo: number = random(0, 1000)

  nodoDerecha:
    | Nodo
    | FDAContatenacion
    | FDASimple
    | FDACerraduraKleen = new Nodo({
    esInicial: false,
    esFinal: true,
    esDesechado: false,
    fda: this
  })

  constructor (caracter: string, numeroNodo: number) {
    this.caracter = caracter
    this.numeroNodo = numeroNodo
  }
  setNodoDerecha (
    nodoDerecha: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any {
    this.nodoDerecha = nodoDerecha
  }
  setNodoIzquierda (): any {}
}

export default FDASimple