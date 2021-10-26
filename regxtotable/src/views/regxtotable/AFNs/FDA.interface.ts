import FDACerraduraKleen from "./FDACerradura";
import FDAContatenacion from "./FDAConcatenacion";
import FDASimple from "./FDASimple";
import Nodo from "./Nodo";

interface FDA {
  numeroNodo: number
  caracter: string
  nodoDerecha: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen

  setNodoDerecha(
    nodoDerecha: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any
  setNodoIzquierda(
    nodoIzquierda: Nodo | FDAContatenacion | FDASimple | FDACerraduraKleen
  ): any
}
export default FDA