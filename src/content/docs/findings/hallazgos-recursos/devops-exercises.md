---
title: "DevOps Exercises: banco de preguntas y ejercicios de DevOps"
description: "Repositorio de Arie Bregman con unas 2.600 preguntas y ejercicios sobre Linux, redes, Git, Docker, Kubernetes, nubes, Terraform, CI/CD, bases de datos y diseño de sistemas, pensado para estudiar y repasar antes de una entrevista."
tags: [devops, sre, entrevistas, linux, kubernetes, docker, aws, terraform, github, aprendizaje]
sidebar:
  order: 7
draft: false
resourceCategory: learning
url: https://github.com/bregman-arie/devops-exercises
technologies:
  - devops/devops-fundamentos/devops-fundamentals-terminology
  - devops/docker-conceptos/docker-que-es
  - devops/cloud-fundamentos/devops-cloud-fundamentals
  - devops/infraestructura-codigo/devops-infraestructura-como-codigo
  - findings/hallazgos-recursos/guia-entrevistas-devcaress
note: "Licencia CC BY-NC-ND 3.0: puedes leerlo y compartirlo citando al autor, pero no usarlo con fines comerciales ni publicar versiones modificadas. Está en inglés, con traducciones parciales del README al portugués y al chino."
warnings:
  - "La licencia no comercial y sin obras derivadas impide reutilizar las preguntas en un curso de pago, una plataforma de formación o material interno de una empresa, y también traducirlas o adaptarlas para publicarlas."
  - "Muchas preguntas no tienen respuesta y otras llevan años sin revisarse. El último commit es de diciembre de 2025: contrasta lo que leas con la documentación oficial de cada herramienta."
updatedAt: 2026-11-16
---

> Creado y mantenido por **[Arie Bregman](https://github.com/bregman-arie)**, con licencia **CC BY-NC-ND 3.0**. Unas 87.000 estrellas y más de 20.000 forks.

## En pocas palabras

**devops-exercises** es un repositorio de GitHub que reúne preguntas y ejercicios sobre los temas que rodean el trabajo de DevOps y SRE (_Site Reliability Engineering_, la disciplina que aplica ingeniería de software a la operación de sistemas en producción). El contador del README marca **2.624 ejercicios y preguntas** repartidos en más de 40 temas.

La mayoría son preguntas con la respuesta plegada (_¿qué es una IP privada y cuándo usarla?_) y una parte son ejercicios prácticos con enunciado y solución en archivos aparte, como montar un «Hello World» en alta disponibilidad o mejorar una consulta SQL.

## Qué cubre

| Bloque                   | Temas                                                                  |
| ------------------------ | ---------------------------------------------------------------------- |
| Sistemas                 | Linux, sistemas operativos, virtualización, shell scripting, hardware  |
| Redes                    | Redes, DNS, certificados                                               |
| Código y control         | Git, desarrollo de software, Python y Go (en repos aparte), Perl, regex |
| Contenedores y orquestar | Docker y contenedores, Kubernetes, OpenShift, Argo                     |
| Nube                     | Cloud en general, AWS, Azure, Google Cloud, OpenStack                  |
| Automatización           | Terraform, Ansible, Puppet, CI/CD, Jenkins, CircleCI, Zuul             |
| Datos                    | Bases de datos, SQL, MongoDB, Kafka, Big Data, almacenamiento          |
| Observabilidad           | Prometheus, Grafana, Elastic, observabilidad                           |
| Diseño y práctica        | Diseño de sistemas, sistemas distribuidos, chaos engineering, seguridad, soft skills |

Cada tema importante tiene su propio `README.md` dentro de `topics/`, así que puedes estudiar uno sin recorrer el README principal, que es enorme.

## Cómo sacarle partido

1. Elige un tema que estés aprendiendo, no el repo entero. El propio autor avisa de que ser DevOps no consiste en dominar todo lo que aparece ahí.
2. Responde en voz alta o por escrito **antes** de desplegar la respuesta. Si la pregunta no tiene respuesta, búscala en la documentación oficial: el FAQ del repo lo plantea como parte del ejercicio.
3. Haz los ejercicios prácticos en un entorno real o local. Para los de AWS puedes usar un emulador como [Floci](/findings/hallazgos-codigo/floci) o [AWS Emulator](/findings/hallazgos-codigo/aws-emulator) en lugar de una cuenta de pago.

Para clonarlo y buscar por tema desde la terminal:

```bash
git clone https://github.com/bregman-arie/devops-exercises.git
grep -ril "terraform state" devops-exercises/topics
```

## Cuándo conviene y cuándo no

Conviene como banco de repaso: para detectar huecos («no sé explicar qué hace un _inode_») y para practicar respuestas cortas antes de una entrevista técnica.

No sirve como curso: no hay un orden de aprendizaje ni explicaciones largas. Y no es un simulacro fiel de entrevista: el README avisa de que la mayoría de las preguntas no representan una entrevista real. Para el proceso de entrevistas en sí, mira la [guía de DevCaress](/findings/hallazgos-recursos/guia-entrevistas-devcaress).

## Límites y precauciones

- El README principal ocupa miles de líneas; en GitHub se lee mejor desde los `README.md` de cada tema.
- Algunas preguntas copian listas de blogs de terceros, citados en el propio texto.
- El README enlaza a apps de práctica en Google Play (KubePrep, Linux Master, System Design Hero) que no forman parte del repositorio.

## Fuentes

- [Repositorio y README](https://github.com/bregman-arie/devops-exercises)
- [FAQ del repositorio](https://github.com/bregman-arie/devops-exercises/blob/master/faq.md)
- [Licencia CC BY-NC-ND 3.0](https://creativecommons.org/licenses/by-nc-nd/3.0/)
