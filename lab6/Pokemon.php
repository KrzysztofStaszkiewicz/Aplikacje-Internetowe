<?php
namespace App\Model;

use App\Service\Config;

class Pokemon
{
    private ?int $id = null;
    private ?string $name = null;
    private ?string $type = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Pokemon
    {
        $this->id = $id;
        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): Pokemon
    {
        $this->name = $name;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(?string $type): Pokemon
    {
        $this->type = $type;
        return $this;
    }

    public static function fromArray($array): Pokemon
    {
        $pokemon = new self();
        $pokemon->fill($array);
        return $pokemon;
    }

    public function fill($array): Pokemon
    {
        if (isset($array['id']) && !$this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['name'])) {
            $this->setName($array['name']);
        }
        if (isset($array['type'])) {
            $this->setType($array['type']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM pokemon';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $pokemons = [];
        $pokemonsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($pokemonsArray as $item) {
            $pokemons[] = self::fromArray($item);
        }
        return $pokemons;
    }

    public static function find($id): ?Pokemon
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM pokemon WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $itemArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (!$itemArray) {
            return null;
        }
        return self::fromArray($itemArray);
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (!$this->getId()) {
            $sql = "INSERT INTO pokemon (name, type) VALUES (:name, :type)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'name' => $this->getName(),
                'type' => $this->getType(),
            ]);
            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE pokemon SET name = :name, type = :type WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':name' => $this->getName(),
                ':type' => $this->getType(),
                ':id'   => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM pokemon WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([':id' => $this->getId()]);

        $this->setId(null);
        $this->setName(null);
        $this->setType(null);
    }
}