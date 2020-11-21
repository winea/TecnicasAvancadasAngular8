//CRUD
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Filme } from '../shared/models/filme';
import { ConfigParams } from '../shared/models/config-params';
import { ConfigParamsService } from './config-params.service';
import { identifierModuleUrl } from '@angular/compiler';

//a url esta relacionada com json server porta 3000
//iniciar servidor json-server --watch db.json
const url = 'http://localhost:3000/filmes/';
@Injectable({
  providedIn: 'root'
})
export class FilmesService {

  //http responsavel por fazer as comunicações
  constructor(private http: HttpClient,
              private configService: ConfigParamsService) { }

  //manipular dados back end

  //ja converte para json, usa interface Filme garantir o que esta vindo do backend é o que o Front precisa
  salvar(filme: Filme): Observable<Filme>{
    return this.http.post<Filme>(url, filme);
  }

  editar(filme: Filme): Observable<Filme>{
    return this.http.put<Filme>(url + filme.id, filme);
  }

  
  listar(config: ConfigParams): Observable<Filme[]> {
    const configParams = this.configService.configurarParametros(config);
    return this.http.get<Filme[]>(url, {params: configParams});
  }

  visualizar(id: number): Observable<Filme> {
    return this.http.get<Filme>(url + id);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(url + id);
  }
  // listar(): Observable<Filme[]> {
  //   return this.http.get<Filme[]>(url);
  // }

  //fazer paginação ja existe json server GET /posts?_page=7&_limit=20
  //metodos que esta alterando url, passado para config-params.service
  //listar(pagina: number, qtdPagina: number, texto: string, genero: string): Observable<Filme[]> {
  // listar(config: ConfigParams): Observable<Filme[]> {
  //   let httpParams = new HttpParams();
  //   httpParams = httpParams.set('_page', pagina.toString())
  //   httpParams = httpParams.set('_limit', qtdPagina.toString());
  //   //ordenar pela url metodo do json server GET /posts?_sort=views&_order=asc
  //   httpParams = httpParams.set('_sort', 'id')
  //   httpParams = httpParams.set('_order', 'desc');
  //   //campos opcionais
  //   if (texto) {
  //     //metodo Full-text search do json server (GET /posts?q=internet)
  //     httpParams = httpParams.set('q', texto);
  //   }
  //   if (genero) {
  //     httpParams = httpParams.set('genero', genero);
  //   }

  //   return this.http.get<Filme[]>(url, {params: httpParams});
  // }

}
