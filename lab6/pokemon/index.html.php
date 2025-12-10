<?php
/** @var \App\Model\Pokemon[] $pokemons */
/** @var \App\Service\Router $router */

$title = 'Pokemon List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Pokemon List</h1>

    <a href="<?= $router->generatePath('pokemon-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($pokemons as $pokemon): ?>
            <li><h3><?= $pokemon->getName() ?> <small>(<?= $pokemon->getType() ?>)</small></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('pokemon-show', ['id' => $pokemon->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('pokemon-edit', ['id' => $pokemon->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>
<?php $main = ob_get_clean();
include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';