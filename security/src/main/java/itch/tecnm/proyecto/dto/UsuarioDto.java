package itch.tecnm.proyecto.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//DTO simple para Usuario
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDto {

 private Integer id;
 private String nombre;       // Nombre del usuario (empleado/cliente)
 private String perfil;       // Rol del usuario
 private String username;     // Nombre de usuario para login
 private Integer estatus;     // 1 = activo, 0 = inactivo
 private LocalDate fechaRegistro;
 private String password;
}