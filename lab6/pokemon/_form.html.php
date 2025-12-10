<?php /** @var $pokemon ?\App\Model\Pokemon */ ?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="pokemon[name]" value="<?= $pokemon ? $pokemon->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="type">Type</label>
    <input type="text" id="type" name="pokemon[type]" value="<?= $pokemon ? $pokemon->getType() : '' ?>">
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>