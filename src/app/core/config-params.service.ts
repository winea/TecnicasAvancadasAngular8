import { Injectable } from '@angular/core';
import { ConfigParams } from '../shared/models/config-params';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigParamsService {

  constructor() { }

  //verificando se ha os campos da interface ConfigParams
  configurarParametros(config: ConfigParams): HttpParams {
    let httpParams = new HttpParams();
    if(config.pagina) {
      httpParams = httpParams.set('_page', config.pagina.toString())
    }
    if (config.limite) {
      httpParams = httpParams.set('_limit', config.limite.toString());
    }
    if(config.pesquisa) {
      //metodo Full-text search do json server (GET /posts?q=internet)
      httpParams = httpParams.set('q', config.pesquisa);
    }
    if (config.campo) {
      //metodo set pede string
      httpParams = httpParams.set(config.campo.tipo, config.campo.valor.toString());
    }

    //ordenar pela url metodo do json server GET /posts?_sort=views&_order=asc
    httpParams = httpParams.set('_sort', 'id');
    httpParams = httpParams.set('_order', 'desc');

    return httpParams;
  }
}
