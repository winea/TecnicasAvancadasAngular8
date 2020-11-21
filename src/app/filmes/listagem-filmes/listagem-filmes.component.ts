import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators'; 
import { Router } from '@angular/router';

import { FilmesService } from 'src/app/core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { ConfigParams } from 'src/app/shared/models/config-params';


@Component({
  selector: 'app-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {
//interface Filme
  // readonly qtdPagina = 4;
  // pagina = 0;
  // texto: string;
  // genero: string;

  readonly semFoto = "../assets/images/no-image-icon.png";
  config: ConfigParams = {
    pagina: 0,
    limite: 4
  };
  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;

  constructor(private filmesService: FilmesService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit() {
    //retornar a consulta precisa subscribe
    //this.filmesService.listar().subscribe((filmes: Filme[]) => this.filmes = filmes);

    this.filtrosListagem = this.fb.group({
      texto: [''],
      genero: ['']
    });

    //alteraçoes valores
    this.filtrosListagem.get('texto').valueChanges
    //para nao executar consulta por caracter, espera 400milissegundos para fazer a consulta
    .pipe(debounceTime(400))
    .subscribe((val: string) => {
      //console.log('alteracao valor texto', val);
      this.config.pesquisa = val;
      this.resetarConsulta();
    });

    this.filtrosListagem.get('genero').valueChanges.subscribe((val: string) => {
      //console.log('alteracao valor genero', val);
      this.config.campo= {tipo: 'genero', valor: val};
      this.resetarConsulta();
    });

    this.generos = ['Ação', 'Romance', 'Comédia', 'Terror', 'Ficção Científica', 'Aventura', 'Drama'];

    this.listarFilmes();
  }

  //qdo chega fim scroll carrega mais registros
  onScroll(): void {
    this.listarFilmes();
    console.log('mais pagina');
  }

  abrir(id:number): void {
    this.router.navigateByUrl('/filmes/'+ id);
  }

  //GET /posts?_page=7&_limit=20
  private listarFilmes(): void {
    //preciso manter filmes e adicionar novos carregador(contaternar array)
    this.config.pagina++;
    //this.filmesService.listar(this.pagina, this.qtdPagina, this.texto, this.genero)
    this.filmesService.listar(this.config)
    .subscribe((filmes: Filme[]) => this.filmes.push(...filmes));
  }

  private resetarConsulta(): void {
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes();
  }

}
