<?php
/** @var \App\Model\Pokemon $pokemon */
/** @var \App\Service\Router $router */

$title = "{$pokemon->getName()} ({$pokemon->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $pokemon->getName() ?></h1>
    <article>
        Type: <?= $pokemon->getType();?>
    </article>
    <ul class="action-list">
        <li><a href="<?= $router->generatePath('pokemon-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('pokemon-edit', ['id'=> $pokemon->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();
include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';