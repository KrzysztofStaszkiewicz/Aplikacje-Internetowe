<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Pokemon;
use App\Service\Router;
use App\Service\Templating;

class PokemonController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $pokemons = Pokemon::findAll();
        $html = $templating->render('pokemon/index.html.php', [
            'pokemons' => $pokemons,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
    {
        if ($requestPost) {
            $pokemon = Pokemon::fromArray($requestPost);
            $pokemon->save();

            $path = $router->generatePath('pokemon-index');
            $router->redirect($path);
            return null;
        } else {
            $pokemon = new Pokemon();
        }

        $html = $templating->render('pokemon/create.html.php', [
            'pokemon' => $pokemon,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $id, ?array $requestPost, Templating $templating, Router $router): ?string
    {
        $pokemon = Pokemon::find($id);
        if (!$pokemon) {
            throw new NotFoundException("Missing pokemon with id $id");
        }

        if ($requestPost) {
            $pokemon->fill($requestPost);
            $pokemon->save();

            $path = $router->generatePath('pokemon-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('pokemon/edit.html.php', [
            'pokemon' => $pokemon,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $id, Templating $templating, Router $router): ?string
    {
        $pokemon = Pokemon::find($id);
        if (!$pokemon) {
            throw new NotFoundException("Missing pokemon with id $id");
        }

        $html = $templating->render('pokemon/show.html.php', [
            'pokemon' => $pokemon,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $id, Router $router): ?string
    {
        $pokemon = Pokemon::find($id);
        if (!$pokemon) {
            throw new NotFoundException("Missing pokemon with id $id");
        }

        $pokemon->delete();
        $path = $router->generatePath('pokemon-index');
        $router->redirect($path);
        return null;
    }
}