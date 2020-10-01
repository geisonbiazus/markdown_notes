package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	yaml := ""

	scanner := bufio.NewScanner(os.Stdin)
	for scanner.Scan() {
		yaml += scanner.Text() + "\n"
	}

	args := os.Args[1:]

	newYaml, err := UpdateYAML(yaml, args...)

	if err != nil {
		fmt.Print(yaml)
	}

	fmt.Print(newYaml)
}
