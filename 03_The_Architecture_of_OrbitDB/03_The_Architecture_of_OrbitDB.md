# Part 3: The Architecture of OrbitDB

## Introduction

You may still find yourself wondering "but exactly _how_ does OrbitDB use IPFS to store, manage, and edit data?" This part is for you. You'll now start from the very bottom of the stack and work your way up to the OrbitDB Javascript API layer, allowing you to understand, in depth, exactly what's going on internally

This part of the book can be read start-to-finish, or you can utilize it like a reference section, obtaining knowledge from here when you need it. This part culminates in a workshop section that explains how to create your own pluggable stores, allowing for massive amounts of flexibility when designing your own OrbitDB-based applications.

## IPFS, Merkle DAGs, and CRDTs

### The IPFS Merkle DAG

### CRDTs

## The `ipfs-log` package

### Basic `ipfs-log` commands

### Dissecting a log entry

## The OrbitDB Stores

### Keyvalue
### Docstore
### Counter
### Log
### Feed

## Workshop: Creating Your Own Store

* Resolves #[342](https://github.com/orbitdb/orbit-db/issues/342) Data persistence on IPFS
