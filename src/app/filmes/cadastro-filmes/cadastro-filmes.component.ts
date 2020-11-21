import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Filme } from 'src/app/shared/models/filme';
import { FilmesService } from 'src/app/core/filmes.service';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';


@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>;
  id: number;

  //Adicionado validacao errors, para formulario
  constructor(public validacao:ValidarCamposService,
              public dialog: MatDialog, 
              private fb: FormBuilder,
              private filmeService: FilmesService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  //para tratar os error
  get f() {
    return this.cadastro.controls;
  }


  ngOnInit(): void {
    //metodo editar possui id
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.filmeService.visualizar(this.id)
      .subscribe((filme: Filme) => this.criarFromulario(filme));
    } else {
      this.criarFromulario(this.criarFilmeEmBranco());
    }

    this.generos = ['Ação', 'Romance', 'Aventura', 'Terror', 'Ficção cientifica', 'Comédia', 'Aventura', 'Drama'];

  }

  submit(): void {
    this.cadastro.markAllAsTouched(); //para verificar as validações
    if(this.cadastro.invalid) {
      return;
    }
    //alert('Salvo com Sucesso!!\n\n' + JSON.stringify(this.cadastro.value, null,4));
    //as Filme garante que formulario precisa ter os campos tem o nome da interface
    const filme = this.cadastro.getRawValue() as Filme;
    //se tiver id edicao
    if (this.id) {
      filme.id = this.id;
      this.editar(filme);
    } else {
      this.salvar(filme);
    }  
  }

  reiniciarForm():void {
    this.cadastro.reset();
  }

  private criarFromulario(filme: Filme): void {
     //inputs do html e validaçoes do nosso formulario
     this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]
    });
  }

  private criarFilmeEmBranco(): Filme {
    return {
      id: null,
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      urlIMDb: null,
      descricao: null,
      genero: null
    } as Filme;
  }

  //subscribe recebemos um retorno se conseguiu ou nao, realizar o post
  private salvar(filme: Filme): void {
    this.filmeService.salvar(filme).subscribe(() => {
        //sobrescrever informaçoes
        const config = {
          data: {
            btnSucesso: 'Ir para a listagem',
            btnCancelar: 'Cadastrar um novo filme',
            corBtnCancelar: 'primary',
            possuirBtnFechar: true
          } as Alerta
        };

        const dialogRef = this.dialog.open(AlertaComponent, config);
        //depende da opcao alerta vai direcionar para rota
        dialogRef.afterClosed().subscribe((opcao: boolean) => {
          if(opcao){
            this.router.navigateByUrl('filmes');
          } else {
            this.reiniciarForm();
          }
        });
    },
    () => {
      //alert("ERRO AO SALVAR");
      const config = {
        data: {
          titulo: 'Erro ao salvar o registro!',
          descricao: 'Não conseguimos salvar seu registro',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar',
        } as Alerta
      };
      //deixar na mesma tela com tudo preenchido
      this.dialog.open(AlertaComponent, config);
  });
}


private editar(filme: Filme): void {
  this.filmeService.editar(filme).subscribe(() => {
      //sobrescrever informaçoes
      const config = {
        data: {
          descricao: 'seu registro atualizado com sucesso',
          btnSucesso: 'Ir para a listagem',
        } as Alerta
      };

      const dialogRef = this.dialog.open(AlertaComponent, config);
      //depende da opcao alerta vai direcionar para rota
      dialogRef.afterClosed().subscribe(() =>
          this.router.navigateByUrl('filmes'));  
  },
  () => {
    //alert("ERRO AO SALVAR");
    const config = {
      data: {
        titulo: 'Erro ao editar o registro!',
        descricao: 'Não conseguimos editar seu registro',
        corBtnSucesso: 'warn',
        btnSucesso: 'Fechar',
      } as Alerta
    };
    //deixar na mesma tela com tudo preenchido
    this.dialog.open(AlertaComponent, config);
});
}
}

